import { OnInit, OnDestroy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { MatDialog } from "@angular/material";
import { ErrorComponent } from "../../error/error.component";

@Component({
    templateUrl: './vemail.component.html'
})
export class VemailComponent implements OnInit, OnDestroy {
    id: string;
    userID: string;
    link: string;
    random: number;

    constructor(private route: ActivatedRoute, public authService: AuthService, private router: Router,
         private dialog: MatDialog) {
        this.route.queryParams.subscribe(params => {
            this.id = params['id'];
            this.userID = params['userID'];
        })
    }

    ngOnInit() {
        console.log(this.id);
        this.authService.emailVerify(this.id,this.userID)
        .subscribe(response => {
            console.log(response);
            console.log(response.message);
            if(response.message != "Email Verified") {
                this.dialog.open(ErrorComponent, {data: {message: "Error Occured while verifying" }});
            }
            else{
                this.dialog.open(ErrorComponent, {data: {message: response.message}});
            }
            this.router.navigate(['/']);
        },
        error => {
            console.log(error);
        });
    }

    ngOnDestroy() {

    }
}