import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { Comment } from '../shared/comment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Page } from 'ui/page';

@Component({
    moduleId: module.id,
    selector: "modal-content",
    templateUrl: "./comment.component.html"
})
export class CommentComponent {
    commentForm: FormGroup;
    model: Comment = { 'author': '', 'rating': 3, 'comment': '', date: ''};

    constructor(private params: ModalDialogParams, private fb: FormBuilder, private page: Page) {
        this.commentForm = this.fb.group({
            'author': new FormControl(this.model.author, [Validators.required]),
            'rating': new FormControl(this.model.rating),
            'comment': new FormControl(this.model.comment, [Validators.required])
        });

        this.page.on("unloaded", () => {
            // using the unloaded event to close the modal when there is user interaction
            // e.g. user taps outside the modal page
            this.params.closeCallback();
        });
    }

    onSubmit(){
        this.model.date = new Date().toISOString(); //adds current date
        this.params.closeCallback(this.model);
    }

    get author() { return this.commentForm.get('author'); }
    get rating() { return this.commentForm.get('rating'); }
    get comment() { return this.commentForm.get('comment'); }
}

