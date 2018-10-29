<template>
  <div class="ui container">
    <vuetable ref="vuetable"
              api-url="/api/enterprise"
              :fields="fields"
              track-by="account_id"
              pagination-path=""
              @vuetable:pagination-data="onPaginationData"
    >
      <template slot="actions" scope="props">
        <div class="custom-actions">
          <!--
          <button class="ui basic button" @click="onAction('view-item', props.rowData, props.rowIndex)">
            <i class="zoom icon"></i>
          </button>
          -->
          <button class="ui basic button" @click="onAction('edit-item', props.rowData, props.rowIndex)">
            <i class="edit icon"></i>
          </button>
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
          {
            name: 'enterprise_name',
            title: '企业名称',
            titleClass: 'center aligned',
            dataClass: 'center aligned'
          },
          {name: 'account_type', title: '序号(主号备注)'},
          {name: 'alipay_account', title: '支付宝账号'},
          {name: 'bank_name', title: '开户银行'},
          {name: 'bank_quota', title: '银行额度'},
          {name: 'mobile', title: '绑定手机号'},
          {name: 'channel', title: '通道分配'},
          {name: 'frequency', title: '班次分配'},
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