import Vue from 'vue';
import VueRouter from 'vue-router';
import EnterpriseAccount from './components/EnterpriseAccount.vue';
import Operations from './components/Operations.vue';
import FinancialData from './components/FinancialData.vue';

Vue.use(VueRouter);

const routes = [
  {path: '/enterprise_account', component: EnterpriseAccount},
  {path: '/operations', component: Operations},
  {path: '/financial_date', component: FinancialData}
]

export const router = new VueRouter({
  routes
})

