let config = require('../utils/config');
let conn_pool = require('../utils/mysql_connection_pool');

let insert_operations_sql = 'insert into operations (account_id, online_time, offline_time, cancel_reason, day_income, day_expense, frequency, create_date, update_date) values (?,?,?,?,?,?,?,?,?)';
let delete_operations_sql = 'delete from operations where id = ?';
let query_operations_sql = 'select o.*, e.enterprise_name, e.alipay_account from operations o, enterprise_account e where o.account_id = e.account_id order by o.create_date desc limit ?, ?';
let total_operations_sql = 'select count(1) as count from operations';

let getInsertParams = function(body) {
  let params = [];
  let now = new Date();
  params.push(body.account_id);
  params.push(body.online_time);
  params.push(body.offline_time);
  params.push(body.cancel_reason);
  params.push(body.day_income);
  params.push(body.day_expense);
  params.push(body.frequency);
  params.push(now);
  params.push(now);
  return params;
}

exports.update_operations = function (req, res) {
  let ret = {
    status: 'success'
  };
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let action = req.body.action;
    if (action === 'add') {
      connection.query(insert_operations_sql, getInsertParams(req.body), function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(ret);
      });
    } else if (action === 'delete') {
      connection.query(delete_operations_sql, [req.body.id], function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(ret);
      });
    } else {
      ret.status = 'unknown_type';
      res.json(ret);
    }
  });
};

exports.query_operations = function (req, res) {
  let ret = {
    per_page: config.page_count
  }
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(total_operations_sql, function (error, results) {
      ret.total = results[0].count;
      ret.current_page = (req.query && req.query.page) ? req.query.page : 1;
      ret.last_page = parseInt(ret.total / ret.per_page) + ((ret.total % ret.per_page) ? 1 : 0);
      let next_page = ret.current_page + 1;
      if (next_page > ret.last_page) {
        ret.next_page_url = null;
      } else {
        ret.next_page_url = '/api/operations?page=' + next_page;
      }
      let prev_page = ret.current_page - 1;
      if (prev_page < 1) {
        ret.prev_page_url = null;
      } else {
        ret.prev_page_url = '/api/operations?page=' + prev_page;
      }
      ret.from = (ret.current_page - 1) * ret.per_page + 1;
      ret.to = (ret.current_page * ret.per_page) > ret.total ? ret.total : (ret.current_page * ret.per_page);
      connection.query(query_operations_sql, [ret.from - 1, ret.per_page], function (error, results) {
        ret.data = results;
        connection.release();
        if (error) throw error;
        console.log(ret);
        res.json(ret);
      });
    });
  });
};