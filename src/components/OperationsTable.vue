<template>
  <div class="ui container">
    <vuetable ref="vuetable"
              api-url="/api/operations"
              :fields="fields"
              track-by="id"
              pagination-path=""
              @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" scope="props">
        <div class="custom-actions">
          <button class="ui basic button" @click="onAction('delete-item', props.rowData, props.rowIndex)">
            <i class="delete icon"></i>
          </button>
        </div>
      </template>
    </vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
      <vuetable-pagination ref="pagination" @vuetable-pagination:change-page="onChangePage"></vuetable-pagination>
    </div>
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2/src/components/Vuetable';
  import VuetablePagination from 'vuetable-2/src/components/VuetablePagination';
  import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo'

  export default {
    components: {
      Vuetable,
      VuetablePagination,
      VuetablePaginationInfo
    },
    data () {
      return {
        fields: [
          {name: 'enterprise_name', title: '企业名称'},
          {name: 'alipay_account', title: '支付宝账号'},
          {
            name: 'online_time',
            title: '上号时间',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          },
          {name: 'offline_time', title: '下号时间'},
          {name: 'cancel_reason', title: '撤号原因'},
          {name: 'day_income', title: '当天收入'},
          {name: 'day_expense', title: '当天支出'},
          {name: 'frequency', title: '使用班次'},
          {name: 'create_date', title: '创建时间'},
          {name: 'create_by', title: '创建者'},
          {name: 'update_date', title: '修改时间'},
          {name: 'update_by', title: '修改者'},
          {
            name: '__slot:actions',
            title: '操作',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          }
        ]
      }
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData);
        this.$refs.paginationInfo.setPaginationData(paginationData);
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page);
      },
      onAction (action, data, index) {
        this.$emit('action', action, data, index);
      },
      refresh: function () {
        let self = this;
        this.$nextTick(function(){
          self.$refs.vuetable.refresh();
        });
      }
    }
  }
</script>