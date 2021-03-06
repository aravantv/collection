/* globals describe, it */
import assert from 'assert';
import {Observable as O} from 'rxjs';
import rxjsAdapter from '@cycle/rxjs-adapter';
import {makeCollection} from '../src/collection';

const Collection = makeCollection(rxjsAdapter);

function Widget ({props$}) {
  return {
    state$: props$
  };
}

describe('Collection.pluck with different stream libs', () => {
  it('handles adding items', (done) => {
    const props$ = O.never().startWith({foo: 'bar'});

    const collection$ = Collection(Widget, {}, O.of(
      {props$},
      {props$: O.of({baz: 'quix'})}
    ));

    const states$ = Collection.pluck(collection$, item => item.state$);

    const expected = [
      [],
      [],
      [{foo: 'bar'}],
      [{foo: 'bar'}, {baz: 'quix'}]
    ];

    states$.take(expected.length).subscribe({
      next (val) {
        assert.deepEqual(val, expected.shift());
      },
      error (err) {done(err)},
      complete () {
        assert.equal(expected.length, 0);
        done();
      }
    });
  });
});
