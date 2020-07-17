import { Component } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Stopwatch';

  isRunning = false;
  timeTotal = 0;
  startDateTime;

  hoursDisplay: number = 0;
  minutesDisplay: number = 0;
  secondsDisplay: number = 0;

  stopwatch$: Observable<number>;

  startClick$ = new Subject();
  stopClick$ = new Subject();
  waitClick$ = new Subject();
  resetClick$ = new Subject();

  startClick() {
    if (this.isRunning === false) {
       this.startDateTime = performance.now();
       this.isRunning = true;
       this.stopwatch$ = interval(100)
         .pipe(
             takeUntil(this.waitClick$),
             takeUntil(this.stopClick$),
             takeUntil(this.resetClick$)
         );

       this.stopwatch$.subscribe(() => {
           const time = performance.now();
           const timeDifference = time - this.startDateTime;
           const currentTime = this.timeTotal + timeDifference;

           this.secondsDisplay =  this.getSeconds(currentTime);
           this.minutesDisplay = this.getMinutes(currentTime);
           this.hoursDisplay = this.getHours(currentTime);
       });
    }
  }

  waitClick() {
    if (this.isRunning) {
      const time = performance.now();
      const timeDifference = time - this.startDateTime;
      this.timeTotal = this.timeTotal + timeDifference;

      this.waitClick$.next();
      this.isRunning = false;
    }
  }

  reset() {
    if (this.isRunning || this.timeTotal !== 0) {
        this.timeTotal = 0;
        this.resetClick$.next();
        this.isRunning = false;
        this.startClick();
    }
  }

  stopClick() {
    this.timeTotal = 0;
    this.minutesDisplay = 0;
    this.hoursDisplay = 0;
    this.secondsDisplay = 0;

    this.stopClick$.next();
    this.isRunning = false;
  }


getSeconds(duration: number) {
    return this.pad(Math.floor(duration / 1000) % 60);
}

getMinutes(duration: number) {
    return this.pad(Math.floor(duration / (1000 * 60)) % 60);
}

getHours(duration: number) {
    return this.pad(Math.floor(duration  / (1000 * 60 * 60)) % 24);
}

pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

}
