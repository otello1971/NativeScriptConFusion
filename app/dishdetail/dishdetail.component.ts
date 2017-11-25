import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavoriteService } from '../services/favorite.service';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Toasty } from 'nativescript-toasty';
import { action } from "ui/dialogs";

//In case you're using "comment" folder (in lowercase), please modify here:
import { CommentComponent } from '../Comment/comment.component';


@Component({
    selector: 'app-dishdetail',
    moduleId: module.id,
    templateUrl: './dishdetail.component.html',
    styleUrls: ['./dishdetail.component.css'
    ]
})
export class DishdetailComponent implements OnInit {
    dish: Dish;
    comment: Comment;
    errMess: string;
    avgstars: string;
    numcomments: number;
    favorite: boolean = false;
    height = 0;  //height for the comments list adjustment
    public result: string;

    constructor(private dishservice: DishService,
        private favoriteservice: FavoriteService,
        private fonticon: TNSFontIconService,
        private route: ActivatedRoute,
        private routerExtensions: RouterExtensions,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,  
        @Inject('BaseURL') private BaseURL) { }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.dishservice.getDish(+params['id']))
            .subscribe(
                dish => {
                    this.dish = dish;
                    this.favorite = this.favoriteservice.isFavorite(this.dish.id);
                    this.numcomments = this.dish.comments.length;
                    let total = 0;
                    this.dish.comments.forEach(comment => total += comment.rating);
                    this.avgstars = (total / this.numcomments).toFixed(2);
                    this.height = 100 + 85 * this.dish.comments.length;
                },
                errmess => { 
                    this.dish = null; this.errMess = <any>errmess; 
                });
    }

    addToFavorites() {
        if (!this.favorite) {
          console.log('Adding to Favorites', this.dish.id);
          this.favorite = this.favoriteservice.addFavorite(this.dish.id);
          const toast = new Toasty("Added Dish "+ this.dish.id, "short", "bottom");
          toast.show();
        }
      }
    goBack(): void {
        this.routerExtensions.back();
    }

// *******************************************************
// ****                ASSIGNMENT 2                    ***
// *******************************************************
    
    openActionDialog(){
        let options = {
            title: "Actions",
            // message: "no message",
            cancelButtonText: "Cancel",
            actions: ["Add to favorites", "Add Commnent"]
        };
        
        action(options).then((result) => {
            console.log(result);
            switch (result) {
                case "Add to favorites":
                    this.addToFavorites();
                    break;
                case "Add Commnent":
                    this.openCommentDialog();
            }
        });
    }

    openCommentDialog(){
        let options: ModalDialogOptions = {
            // context: { isFavorite: this.favorite},
            // fullscreen: true,
            viewContainerRef: this.viewContainerRef
        };
        
        this.modalService.showModal(CommentComponent, options)
            .then((dialogResult: Comment) => {
                if(dialogResult){
                    this.dish.comments.push(dialogResult);
                    this.height += 85; // adjusting comments ListView height
                }
            },
            () => console.log('Dishdetail: error retrieving comment info.')
           );
    }
}