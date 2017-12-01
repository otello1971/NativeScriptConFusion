import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";

import { Page } from "ui/page";
import { View } from "ui/core/view";
import { Animation, AnimationDefinition } from "ui/animation";
import * as enums from "ui/enums";
import { CouchbaseService } from '../services/couchbase.service';

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {
    model = { 'guests': '', 'smoking': false, 'dateTime': ''};
    reservation: FormGroup;
    submitted: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private modalService: ModalDialogService,
                private page: Page,
                private couchbaseService: CouchbaseService,
                private vcRef: ViewContainerRef) 
    {
        super(changeDetectorRef);
    }

    ngOnInit() {
        this.reservation = this.formBuilder.group({
            guests: new FormControl(this.model.guests, [Validators.required]),
            smoking: new FormControl(this.model.smoking),
            dateTime: new FormControl(this.model.dateTime, [Validators.required]),
        });
    }

    createModalView(args) {
        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({ guests: result });
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result });
                }
            });
    }

    get guests() { return this.reservation.get('guests'); }
    get smoking() { return this.reservation.get('smoking'); }
    get dateTime() { return this.reservation.get('dateTime'); }

    // *************************************************************************
    // ***                            ASSIGNMENT 3                           ***
    // *************************************************************************
    zoomingInOut(){
        let inputForm = this.page.getViewById<View>('inputForm');
        inputForm.animate({
            scale: { x: 0, y: 0}, 
            opacity: 0.0,
            duration: 500,
            curve: enums.AnimationCurve.easeOut}

        ).then(() => {
            this.submitted = true;
            inputForm.animate({
              scale: { x: 1, y: 1}, 
              opacity: 1.0,
              duration: 500,
              curve: enums.AnimationCurve.easeIn}     
        ).catch((e) => {
            console.log(e.message);
        });
        });
    }

    addReservation(oneReservation: any) {
        const docId = 'reservations';
        let reservations = {'reservations': []};
        // this.couchbaseService.deleteDocument(docId);
        let doc = this.couchbaseService.getDocument(docId);

        if(!doc) {
            console.log('This is the first reservation');
            this.couchbaseService.createDocument(reservations, docId);
        }
        doc.reservations.push(oneReservation);
        this.couchbaseService.updateDocument(docId, doc);
        doc = this.couchbaseService.getDocument(docId);
        console.log(JSON.stringify(doc));
    }

    onSubmit() {
        this.zoomingInOut();
        this.addReservation(this.model);
    }
}