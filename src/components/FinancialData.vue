<template>
  <div class="main">
    <div class="list">
      <enterprise-search @action="action"></enterprise-search>
    </div>
    <hr/>
    <div class="list">
      <input type="hidden" size="30" v-model="data.account_id" />
      <span>余额</span><input type="text" size="30" v-model="data.balance" :disabled="input_disable" />
      <span>不可用余额</span><input type="text" size="30" v-model="data.frozen_balance" :disabled="input_disable" />
      <span>30天总收入</span><input type="text" size="30" v-model="data.thirty_day_income" :disabled="input_disable" />
      <span>30天总支出</span><input type="text" size="30" v-model="data.thirty_day_expense" :disabled="input_disable" />
      <span>银行总收入</span><input type="text" size="30" v-model="data.bank_total_income" :disabled="input_disable" />
      <span>查询时间</span><input type="text" size="30" v-model="data.query_time" :disabled="input_disable" />
      <button v-on:click="add">新增</button>
    </div>
    <div class="ui container list">
      <financial-data-table @action="table_action" ref="financial_data_table"></financial-data-table>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import axios from 'axios';
  import EnterpriseSearch from './EnterpriseSearch';
  import FinancialDataTable from './FinancialDataTable';

  export default {
    name: 'FinancialData',
    inject: ['reload'],
    components: {
      EnterpriseSearch,
      FinancialDataTable
    },
    data: function () {
      return {
        input_disable: true,
        data: {
          action: 'add',
          account_id: 0,
          id: 0,
          balance: 0.00,
          frozen_balance: 0.00,
          thirty_day_income: 0.00,
          thirty_day_expense: 0.00,
          bank_total_income: 0.00,
          query_time: ''
        }
      }
    },
    methods: {
      action: function(action, data) {
        if (action === 'searching') {
          this.input_disable = true;
        } else if (action === 'searched') {
          this.input_disable = false;
          this.data.account_id = data.account_id;
        }
      },
      table_action: function(action, data, index) {
        console.log(action, data, index);
        if (action === 'delete-item') {
          this.delete(data);
        }
      },
      has_letter: function(input) {
        let p = /[a-z]/i;
        if (_.isString(input) && p.test(input)) {
          return true;
        }
        return false;
      },
      not_number: function (input) {
        return _.isNaN(input) || this.has_letter(input);
      },
      add: function() {
        if (this.not_number(this.data.balance) || this.not_number(this.data.frozen_balance)
          || this.not_number(this.data.thirty_day_income) || this.not_number(this.data.thirty_day_expense)
          || this.not_number(this.data.bank_total_income)) {
          alert('请输入财务数字信息。');
          return;
        }
        this.data.action = 'add';
        this.remote_call(this.data);
      },
      delete: function (data) {
        data.action = 'delete';
        this.remote_call(data);
      },
      remote_call: function(data) {
        let self = this;
        axios.post('/api/financial', data).then(function (response) {
          console.log(response);
          if (data.action === 'add') {
            alert('恭喜，添加成功！');
          } else if (data.action === 'delete') {
            alert('恭喜，删除成功！');
          }
          self.$refs.financial_data_table.refresh();
        }).catch(function (error) {
          alert(error);
        });
      }
    }
  }
</script>

<style scoped>
  .main div {
    margin-left: 10px;
  }
  .list {
    margin-top: 10px;
  }
</style>

