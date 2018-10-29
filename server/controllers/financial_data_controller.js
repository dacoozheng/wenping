let config = require('../utils/config');
let conn_pool = require('../utils/mysql_connection_pool');

let insert_sql = 'insert into financial_data (account_id, balance, frozen_balance, thirty_day_income, thirty_day_expense, bank_total_income, query_time, create_date, update_date) values (?,?,?,?,?,?,?,?,?)';
let delete_sql = 'delete from financial_data where id = ?';
let query_sql = 'select f.*, e.enterprise_name, e.alipay_account from financial_data f, enterprise_account e where f.account_id = e.account_id order by f.create_date desc limit ?, ?';
let total_sql = 'select count(1) as count from financial_data';

let getInsertParams = function(body) {
  let params = [];
  let now = new Date();
  params.push(body.account_id);
  params.push(body.balance);
  params.push(body.frozen_balance);
  params.push(body.thirty_day_income);
  params.push(body.thirty_day_expense);
  params.push(body.bank_total_income);
  params.push(body.query_time);
  params.push(now);
  params.push(now);
  return params;
}

exports.update_financial_data = function (req, res) {
  let ret = {
    status: 'success'
  };
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let action = req.body.action;
    if (action === 'add') {
      connection.query(insert_sql, getInsertParams(req.body), function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(ret);
      });
    } else if (action === 'delete') {
      connection.query(delete_sql, [req.body.id], function (error, results) {
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

exports.query_financial_data = function (req, res) {
  let ret = {
    per_page: config.page_count
  }
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(total_sql, function (error, results) {
      ret.total = results[0].count;
      ret.current_page = (req.query && req.query.page) ? req.query.page : 1;
      ret.last_page = parseInt(ret.total / ret.per_page) + ((ret.total % ret.per_page) ? 1 : 0);
      let next_page = ret.current_page + 1;
      if (next_page > ret.last_page) {
        ret.next_page_url = null;
      } else {
        ret.next_page_url = '/api/financial?page=' + next_page;
      }
      let prev_page = ret.current_page - 1;
      if (prev_page < 1) {
        ret.prev_page_url = null;
      } else {
        ret.prev_page_url = '/api/financial?page=' + prev_page;
      }
      ret.from = (ret.current_page - 1) * ret.per_page + 1;
      ret.to = (ret.current_page * ret.per_page) > ret.total ? ret.total : (ret.current_page * ret.per_page);
      connection.query(query_sql, [ret.from - 1, ret.per_page], function (error, results) {
        ret.data = results;
        connection.release();
        if (error) throw error;
        console.log(ret);
        res.json(ret);
      });
    });
  });
};