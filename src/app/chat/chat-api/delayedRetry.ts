import { Observable } from 'rxjs/Observable';
import { delay, mergeMap, retryWhen } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

export function delayedRetry(delayMs: number = 500, maxRetry = 5) {
  let retries = maxRetry;

  return (src: Observable<any>) =>
    src.pipe(
      retryWhen((errors:  Observable <any>) => errors.pipe(
        delay(delayMs),
        mergeMap(error => retries-- > 0 ? of(error) : _throw(
          `Tried to load Resource for ${maxRetry} times without success. Source seems to be unavailable.`
        ))
      ))
    );
}
