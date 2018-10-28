drop table operations;
drop table financial_data;
drop table enterprise_account;

create table enterprise_account (
    account_id int auto_increment primary key,
    enterprise_name VARCHAR(512) NOT NULL,
    alipay_account VARCHAR(128) NOT NULL,
    account_type VARCHAR(32),
    bank_name VARCHAR(128),
    bank_quota VARCHAR(128),
    mobile VARCHAR(16),
    channel VARCHAR(128),
    frequency VARCHAR(128),
    create_date datetime,
    create_by VARCHAR(64),
    update_date datetime,
    update_by VARCHAR(64)
);

CREATE UNIQUE INDEX unikey1 ON enterprise_account(enterprise_name, alipay_account);

create table operations (
    id int auto_increment primary key,
    account_id int NOT NULL,
    online_time VARCHAR(32),
    offline_time VARCHAR(32),
    cancel_reason VARCHAR(512),
    day_income decimal(12, 2),
    day_expense decimal(12, 2),
    frequency VARCHAR(128),
    create_date datetime,
    create_by VARCHAR(64),
    update_date datetime,
    update_by VARCHAR(64)
);

alter table operations add constraint operations_fk1 foreign key(account_id) references enterprise_account(account_id);

create table financial_data (
    id int auto_increment primary key,
    account_id int NOT NULL,
    balance decimal(12, 2),
    frozen_balance decimal(12, 2),
    thirty_day_income decimal(12, 2),
    thirty_day_expense decimal(12, 2),
    bank_total_income decimal(12, 2),
    query_time VARCHAR(128),
    create_date datetime,
    create_by VARCHAR(64),
    update_date datetime,
    update_by VARCHAR(64)
);

alter table financial_data add constraint financial_data_fk1 foreign key(account_id) references enterprise_account(account_id);

