insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25de', now(), 'Advanced Sales', 
    sfid from salesforce.account where accountnumber='CC978213';
insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25df', now(), 'Advanced Service', 
    sfid from salesforce.account where accountnumber='CC978213';
insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25dg', now(), 'Advanced Commerce', 
    sfid from salesforce.account where accountnumber='CC978213';
insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25dh', now(), 'Advanced Marketing', 
    sfid from salesforce.account where accountnumber='CC978213';
insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25di', now(), 'Advanced Platform', 
    sfid from salesforce.account where accountnumber='CC978213';
