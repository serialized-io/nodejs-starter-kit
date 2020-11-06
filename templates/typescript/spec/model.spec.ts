import {v4 as uuidv4} from 'uuid';
import {EventEnvelope, StateLoader} from "@serialized/serialized-client";
import {<%= aggregateType %>, <%= aggregateType %>State, <%= aggregateType %>Created, <%= aggregateType %>Started} from "../src/model";

describe('<%= aggregateType %>', () => {

  it('Can create a new <%= aggregateType %>', async () => {

    const state : <%= aggregateType %>State = {}
    const <%= aggregateTypeSlug %> = new <%= aggregateType %>(state);

    const <%= aggregateTypeSlug %>Id = uuidv4();
    expect(game.create(<%= aggregateTypeSlug %>Id)).toStrictEqual([new <%= aggregateType %>Created(<%= aggregateTypeSlug %>Id)])

  }),

  it('Can start a created <%= aggregateType %>', async () => {

    const <%= aggregateTypeSlug %>Id = uuidv4();
    const events = [new <%= aggregateType %>Created(<%= aggregateTypeSlug %>Id)]
    const state : <%= aggregateType %>State = new StateLoader(<%= aggregateType %>).loadState(events.map(EventEnvelope.fromDomainEvent))
    const <%= aggregateTypeSlug %> = new <%= aggregateType %>(state);

    expect(game.start(<%= aggregateTypeSlug %>Id)).toStrictEqual([new <%= aggregateType %>Started(<%= aggregateTypeSlug %>Id)])

  })

});
