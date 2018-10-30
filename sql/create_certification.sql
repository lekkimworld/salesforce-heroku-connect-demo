insert into salesforce.certification__c (external_id__c, date_issued__c, name, account__c) 
    select 'd8b1ee8f-dfad-45e5-bfbf-f0e28daf25de', now(), 'Advanced Sales', 
    sfid from salesforce.account where accountnumber='CC978213';
