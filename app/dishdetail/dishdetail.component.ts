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

import { Page } from "ui/page";
import { Animation, AnimationDefinition } from "ui/animation";
import { View } from "ui/core/view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import { Color } from 'color';
import * as enums from "ui/enums";

import * as SocialShare from "nativescript-social-share";
import { ImageSource, fromUrl } from "image-source";

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
    showComments: boolean = false;

    cardImage: View;
    commentList: View;
    cardLayout: View;

    constructor(private dishservice: DishService,
        private favoriteservice: FavoriteService,
        private fonticon: TNSFontIconService,
        private route: ActivatedRoute,
        private routerExtensions: RouterExtensions,
        private modalService: ModalDialogService,
        private viewContainerRef: ViewContainerRef,
        private page: Page,
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
            const toast = new Toasty("Added Dish " + this.dish.id, "short", "bottom");
            toast.show();
        }
    }
    goBack(): void {
        this.routerExtensions.back();
    }

    openActionDialog() {
        let options = {
            title: "Actions",
            // message: "no message",
            cancelButtonText: "Cancel",
            actions: ["Add to Favorites", "Add Comment", "Social Sharing"]
        };

        action(options).then((result) => {
            console.log(result);
            switch (result) {
                case 'Add to favorites':
                    this.addToFavorites();
                    break;
                case 'Add Commnent':
                    this.openCommentDialog();
                    break;
                case 'Social Sharing': 
                    this.socialShare();
                }
        });
    }

    openCommentDialog() {
        let options: ModalDialogOptions = {
            // context: { isFavorite: this.favorite},
            // fullscreen: true,
            viewContainerRef: this.viewContainerRef
        };

        this.modalService.showModal(CommentComponent, options)
            .then((dialogResult: Comment) => {
                if (dialogResult) {
                    this.dish.comments.push(dialogResult);
                    this.height += 85; // adjusting comments ListView height
                }
            },
            () => console.log('Dishdetail: error retrieving comment info.')
            );
    }

    onSwipe(args: SwipeGestureEventData) {

        if (this.dish) {
            this.cardImage = <View>this.page.getViewById<View>("cardImage");
            this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
            this.commentList = <View>this.page.getViewById<View>("commentList");

            if (args.direction === SwipeDirection.up && !this.showComments) {
                this.animateUp();
            }
            else if (args.direction === SwipeDirection.down && this.showComments) {
                this.showComments = false;
                this.animateDown();
            }
        }

    }

    showAndHideComments() {
        this.cardImage = <View>this.page.getViewById<View>("cardImage");
        this.cardLayout = <View>this.page.getViewById<View>("cardLayout");
        this.commentList = <View>this.page.getViewById<View>("commentList");

        if (!this.showComments) {
            this.animateUp();
        }
        else if (this.showComments) {
            this.showComments = false;
            this.animateDown();
        }
    }

    animateUp() {
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: this.cardImage,
            scale: { x: 1, y: 0 },
            translate: { x: 0, y: -200 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let a2: AnimationDefinition = {
            target: this.cardLayout,
            backgroundColor: new Color("#ffc107"),
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);

        let animationSet = new Animation(definitions);

        animationSet.play().then(() => {
            this.showComments = true;
        })
            .catch((e) => {
                console.log(e.message);
            });
    }

    animateDown() {
        let definitions = new Array<AnimationDefinition>();
        let a1: AnimationDefinition = {
            target: this.cardImage,
            scale: { x: 1, y: 1 },
            translate: { x: 0, y: 0 },
            opacity: 1,
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a1);

        let a2: AnimationDefinition = {
            target: this.cardLayout,
            backgroundColor: new Color("#ffffff"),
            duration: 500,
            curve: enums.AnimationCurve.easeIn
        };
        definitions.push(a2);

        let animationSet = new Animation(definitions);

        animationSet.play().then(() => {
        })
            .catch((e) => {
                console.log(e.message);
            });
    }

    socialShare() {
        fromUrl(this.BaseURL + this.dish.image)
            .then((img: ImageSource) => {
                SocialShare.shareImage(img, "How would you like to share this image?")
            })
            .catch(() => { console.log('Error loading image'); });
    }

}