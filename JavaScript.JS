//import { LightningElement,track,wire} from 'lwc';
import {
    LightningElement,
    api,
    track,
    wire
} from 'lwc';
import {
    CloseActionScreenEvent
} from 'lightning/actions';
import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';
import TaskRec from '@salesforce/schema/Task';
import getAllpicklists from '@salesforce/apex/GetTaskPicklistFields.getAllpicklists';

import {
    CurrentPageReference
} from 'lightning/navigation';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

import insertTask from '@salesforce/apex/GetTaskPicklistFields.insertTask';

import fetchRecords from '@salesforce/apex/GetTaskPicklistFields.fetchRecords';

export default class karthikademo extends LightningElement {
    @api recordId;

    isModalOpen = true;
    @track TaskTypeOptions = [];
    // subject;
    submitAndNewRec = false;
    showHideSpinner = false;
    currentRecvalue;
    PurposePicklistOptions;
    subjectPicklistOptions;
    statusPicklistOptions;
    locationPicklistOptions;
    outcomePicklistOptions;

    newTaskRec = {
        'sobjectType': 'Task',
        'Task_Type__c': '',
        'Status': '',
        'Subject__c': '',
        'ActivityDate': '',
        'OwnerId': '',
        'WhatId': '',
        'Description': '',
        'Purpose__c': '',
        'Outcome__c': '',
        'Location__c': ''

    };
    /***Lookup related to**/
    objectName = 'Opportunity';
    fieldName = 'Name';
    value = this.recordId;
    iconName = 'standard:opportunity';
    label = 'Related To';
    placeholder = 'Search Opportunity';
    className;
    required = false;
    @track searchString;
    @track selectedRecord;
    @track recordsList;
    @track message;
    @track showPill = false;
    @track showSpinner = false;
    @track showDropdown = false;

    /***Lookup Assigned to* */

    objectName1 = 'User';
    fieldName1 = 'Name';
    value1 = this.recordId;
    iconName1 = 'standard:user';
    label1 = 'Assigned To';
    placeholder1 = 'Search user';
    className1;
    required1 = false;
    @track searchString1;
    @track selectedRecord1;
    @track recordsList1;
    @track message1;
    @track showPill1 = false;
    @track showSpinner1 = false;
    @track showDropdown1 = false;
    // @track recordTypeIds;

    /* @wire(getObjectInfo, { objectApiName: TaskRec })
handleObjectInfo({error, data}) {
    if (data) {
        const rtis = data.recordTypeInfos;
        this.recordTypeIds = Object.keys(rtis).find(rti => rtis[rti].name === 'Phone');
               console.log('recordTypeIds',JSON.stringify(this.recordTypeIds));
     
    }
}*/



    @wire(getAllpicklists, {
        OppID: '$recordId'
    })
    getAllpickListvalues({
        error,
        data
    }) {
        if (data) {
            this.pickvalues = data;
            this.TaskTypeOptions = this.pickvalues.Task_Type;
            this.PurposePicklistOptions = this.pickvalues.Purpose;
            this.subjectPicklistOptions = this.pickvalues.Status;
            this.locationPicklistOptions = this.pickvalues.Location;
            this.statusPicklistOptions = this.pickvalues.Status
            this.outcomePicklistOptions = this.pickvalues.Outcome;
            this.selectedRecord = this.pickvalues.currentRec;
            this.selectedRecord1 = this.pickvalues.currentUserRec;
            this.showPill = true;
            this.showPill1 = true;

            console.log('pickvalues', JSON.stringify(this.pickvalues.currentRec));
        } else if (error) {
            console.log(error);
            this.error = error;
        }
    }

    /* get currentRecvalue(){
       //  console.log('currentRecvalue',JSON.stringify( this.oppDetails.data));
         return {'value' : this.recordId,'label':this.oppDetails.data.fields.Name.value};
     }*/




    closeModal() {
        this.dispatchEvent(new CloseActionScreenEvent());
        //  this.isModalOpen = false;
    }


    changeActivityDT(event) {
        console.log('===>', event.target.value);
        this.newTaskRec.ActivityDate = event.target.value;
    }

    handleTaskType(event) {
        this.newTaskRec.Task_Type__c = event.target.value;
        console.log('===>', this.newTaskRec);
    }

    handlerpurpose(event) {
        this.newTaskRec.Purpose__c = event.target.value;
    }
    handlersubject(event) {
        this.newTaskRec.Subject__c = event.target.value;
        console.log('this.subject' + this.newTaskRec);
    }

    handlerlocation(event) {
        this.newTaskRec.Location__c = event.target.value;
    }

    handlerstatus(event) {
        this.newTaskRec.Status = event.target.value;
    }

    handleroutcome(event) {
        this.newTaskRec.Outcome__c = event.target.value;
    }
    handlercomments(event) {
        this.newTaskRec.Description = event.target.value;
    }

    handleOppSelection(event) {
        console.log("the selected record id is" + event.detail);
    }


    handleUsrSelection(event) {
        console.log("the selected record id is" + event.detail);
    }
    submitDetails() {
        this.showHideSpinner = true;
        this.submitAndNewRec = false;
        this.createTaskRecrods();
    }

    submitDetailsAndNew() {
        this.showHideSpinner = true;
        this.submitAndNewRec = true;
        this.createTaskRecrods();
    }

    createTaskRecrods() {
        this.newTaskRec.WhatId = this.selectedRecord.value;
        this.newTaskRec.OwnerId = this.selectedRecord1.value;
        console.log('-fdfd-------', JSON.stringify(this.newTaskRec));
        console.log('--------', this.newTaskRec);
        insertTask({
                taskRecords: this.newTaskRec
            })
            .then(result => {
                console.log(' final submited record--------', JSON.stringify(result));
                this.updateRecordView();
                this.showToast('Success', result, 'Success', 'dismissable');
            })
            .catch(error => {
                this.showHideSpinner = false;
                this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
                this.error = error.message;
                console.log(' final error record--------', error.message);
                //alert(JSON.stringify(error))
            });
        // this.isModalOpen = false;
    }

    updateRecordView() {
        if (!this.submitAndNewRec) {
            this.showHideSpinner = false;
            this.dispatchEvent(new CloseActionScreenEvent());
        } else {

            this.newTaskRec = {
                'sobjectType': 'Task',
                'Task_Type__c': '',
                'Status': '',
                'Subject__c': '',
                'ActivityDate': '',
                'OwnerId': '',
                'WhatId': '',
                'Description': '',
                'Purpose__c': '',
                'Outcome__c': '',
                'Location__c': ''

            };
            this.showHideSpinner = false;
        }
        setTimeout(() => {
            eval("$A.get('e.force:refreshView').fire();");
        }, 1000);
    }

    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }
    /***Lookup 1 */


    connectedCallback() {
        if (this.value)
            this.fetchData();
        if (this.value1)
            this.fetchData1();
    }

    searchRecords(event) {
        this.searchString = event.target.value;
        if (this.searchString) {
            this.fetchData();
        } else {
            this.showDropdown = false;
        }
    }

    selectItem(event) {
        if (event.currentTarget.dataset.key) {
            var index = this.recordsList.findIndex(x => x.value === event.currentTarget.dataset.key)
            if (index != -1) {
                this.selectedRecord = this.recordsList[index];
                this.value = this.selectedRecord.value;
                console.log('this.vaule----------', this.value);
                this.showDropdown = false;
                this.showPill = true;
            }
        }
    }

    removeItem() {
        // this.showPill = false;
        // this.value = '';
        //  this.selectedRecord = '';
        this.searchString = '';
    }

    showRecords() {
        if (this.recordsList && this.searchString) {
            this.showDropdown = true;
        }
    }

    blurEvent() {
        this.showDropdown = false;
    }



    fetchData() {
        this.showSpinner = true;
        this.message = '';
        this.recordsList = [];
        fetchRecords({
                objectName: this.objectName,
                filterField: this.fieldName,
                searchString: this.searchString,
                value: this.value
            })
            .then(result => {
                if (result && result.length > 0) {
                    if (this.value) {
                        this.selectedRecord = result[0];
                        this.showPill = true;
                    } else {
                        this.recordsList = result;
                    }
                } else {
                    this.message = "No Records Found for '" + this.searchString + "'";
                }
                this.showSpinner = false;
            }).catch(error => {
                this.message = error.message;
                this.showSpinner = false;
            })
        if (!this.value) {
            this.showDropdown = true;
        }
    }


    searchRecords1(event) {
        this.searchString1 = event.target.value;
        if (this.searchString1) {
            this.fetchData1();
        } else {
            this.showDropdown1 = false;
        }
    }

    selectItem1(event) {
        if (event.currentTarget.dataset.key) {
            var index = this.recordsList1.findIndex(x => x.value === event.currentTarget.dataset.key)
            if (index != -1) {
                this.selectedRecord1 = this.recordsList1[index];
                this.value1 = this.selectedRecord1.value;
                console.log('this.vaule----------', this.value);
                this.showDropdown1 = false;
                this.showPill1 = true;
            }
        }
    }

    removeItem1() {
        // this.showPill1 = false;
        //  this.value1 = '';
        //  this.selectedRecord1 = '';
        this.searchString1 = '';
    }

    showRecords1() {
        if (this.recordsList1 && this.searchString1) {
            this.showDropdown1 = true;
        }
    }

    blurEvent1() {
        this.showDropdown1 = false;
    }



    fetchData1() {
        this.showSpinner1 = true;
        this.message1 = '';
        this.recordsList1 = [];
        fetchRecords({
                objectName: this.objectName1,
                filterField: this.fieldName1,
                searchString: this.searchString1,
                value: this.value1
            })
            .then(result => {
                if (result && result.length > 0) {
                    if (this.value) {
                        this.selectedRecord1 = result[0];
                        this.showPill1 = true;
                    } else {
                        this.recordsList1 = result;
                    }
                } else {
                    this.message1 = "No Records Found for '" + this.searchString1 + "'";
                }
                this.showSpinner1 = false;
            }).catch(error => {
                this.message1 = error.message;
                this.showSpinner1 = false;
            })
        if (!this.value1) {
            this.showDropdown1 = true;
        }
    }


}
