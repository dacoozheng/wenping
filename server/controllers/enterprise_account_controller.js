let config = require('../utils/config');
let conn_pool = require('../utils/mysql_connection_pool');

let insert_enterprise_account_sql = 'insert into enterprise_account (enterprise_name, account_type, alipay_account, bank_name, bank_quota, mobile, channel, frequency, create_date, update_date) values (?,?,?,?,?,?,?,?,?,?)';
let update_enterprise_account_sql = 'update enterprise_account set enterprise_name = ?, account_type = ?, alipay_account = ?, bank_name = ?, bank_quota = ?, mobile = ?, channel = ?, frequency = ?, update_date = ? where account_id = ?';
let delete_enterprise_account_sql = 'delete from enterprise_account where account_id = ?';
let query_enterprise_account_sql = 'select * from enterprise_account order by create_date desc limit ?, ?';
let total_enterprise_account_sql = 'select count(1) as count from enterprise_account';
let check_exist_sql = 'select * from enterprise_account where enterprise_name = ? and alipay_account = ?';

let getInsertParams = function(body) {
  let params = [];
  let now = new Date();
  params.push(body.enterprise_name);
  params.push(body.account_type);
  params.push(body.alipay_account);
  params.push(body.bank_name);
  params.push(body.bank_quota);
  params.push(body.mobile);
  params.push(body.channel);
  params.push(body.frequency);
  params.push(now);
  params.push(now);
  return params;
}

let getUpdateParams = function(body) {
  let params = [];
  let now = new Date();
  params.push(body.enterprise_name);
  params.push(body.account_type);
  params.push(body.alipay_account);
  params.push(body.bank_name);
  params.push(body.bank_quota);
  params.push(body.mobile);
  params.push(body.channel);
  params.push(body.frequency);
  params.push(now);
  params.push(body.account_id);
  return params;
}

exports.update_enterprise_account = function (req, res) {
  let ret = {
    status: 'success'
  };
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let action = req.body.action;
    if (action === 'add') {
      connection.query(check_exist_sql, [req.body.enterprise_name, req.body.alipay_account], function (error, results) {
        if (!!results && results.length > 0) {
          connection.release();
          ret.status = 'exist';
          res.json(ret);
        } else {
          connection.query(insert_enterprise_account_sql, getInsertParams(req.body), function (error, results) {
            connection.release();
            if (error) throw error;
            res.json(ret);
          });
        }
      });
    } else if (action === 'update') {
      connection.query(update_enterprise_account_sql, getUpdateParams(req.body), function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(ret);
      });
    } else if (action === 'delete') {
      connection.query(delete_enterprise_account_sql, [req.body.account_id], function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(ret);
      });
    } else if (action === 'search') {
      connection.query(check_exist_sql, [req.body.enterprise_name, req.body.alipay_account], function (error, results) {
        connection.release();
        if (error) throw error;
        res.json(results);
      });
    } else {
      ret.status = 'unknown_type';
      res.json(ret);
    }
  });
};

exports.query_enterprise_account = function (req, res) {
  let ret = {
    per_page: config.page_count
  }
  conn_pool.pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(total_enterprise_account_sql, function (error, results) {
      ret.total = results[0].count;
      ret.current_page = (req.query && req.query.page) ? req.query.page : 1;
      ret.last_page = parseInt(ret.total / ret.per_page) + ((ret.total % ret.per_page) ? 1 : 0);
      let next_page = ret.current_page + 1;
      if (next_page > ret.last_page) {
        ret.next_page_url = null;
      } else {
        ret.next_page_url = '/api/enterprise?page=' + next_page;
      }
      let prev_page = ret.current_page - 1;
      if (prev_page < 1) {
        ret.prev_page_url = null;
      } else {
        ret.prev_page_url = '/api/enterprise?page=' + prev_page;
      }
      ret.from = (ret.current_page - 1) * ret.per_page + 1;
      ret.to = (ret.current_page * ret.per_page) > ret.total ? ret.total : (ret.current_page * ret.per_page);
      connection.query(query_enterprise_account_sql, [ret.from - 1, ret.per_page], function (error, results) {
        ret.data = results;
        connection.release();
        if (error) throw error;
        console.log(ret);
        res.json(ret);
      });
    });
  });
};