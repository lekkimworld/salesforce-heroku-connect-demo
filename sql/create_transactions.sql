create extension "uuid-ossp";
create schema tx;
create table tx.transaction (id varchar(40) not null default uuid_generate_v4(), 
    dt timestamp not null default now(), 
    amount double precision not null, account_id character varying(40) not null, primary key (id));

insert into tx.transaction (amount, account_id) select 129000.50, sfid from salesforce.account where accountnumber='CC978213';
insert into tx.transaction (amount, account_id) select 82212.25, sfid from salesforce.account where accountnumber='CC978213';
insert into tx.transaction (amount, account_id) select 45450.50, sfid from salesforce.account where accountnumber='CC978213';
insert into tx.transaction (amount, account_id) select 45450.50, sfid from salesforce.account where accountnumber='CD656092';
insert into tx.transaction (amount, account_id) select 12000.0, sfid from salesforce.account where accountnumber='CD656092';
