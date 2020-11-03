import {DomainEvent, EventHandler, Aggregate} from "@serialized/serialized-client";

class <%= aggregateType %>State {
  readonly <%= aggregateTypeSlug %>Id?: string;
  readonly status?: string;
}

class <%= aggregateType %>Created implements DomainEvent {
  constructor(readonly <%= aggregateTypeSlug %>Id: string) {
  };
}

class <%= aggregateType %>Started implements DomainEvent {
  constructor(readonly <%= aggregateTypeSlug %>Id: string) {
  };
}

class <%= aggregateType %>StateBuilder {

  get initialState() : <%= aggregateType %>State {
    return {status: 'undefined'}
  }

  @EventHandler(<%= aggregateType %>Created)
  handle<%= aggregateType %>Created(event: <%= aggregateType %>Created, state: <%= aggregateType %>State): <%= aggregateType %>State {
    return {<%= aggregateTypeSlug %>Id: state.<%= aggregateTypeSlug %>Id, status: 'created'};
  }

  @EventHandler(<%= aggregateType %>Started)
  handle<%= aggregateType %>Started(event: <%= aggregateType %>Created, state: <%= aggregateType %>State): <%= aggregateType %>State {
    return {<%= aggregateTypeSlug %>Id: state.<%= aggregateTypeSlug %>Id, status: 'started'};
  }

}

@Aggregate('<%= aggregateTypeSlug %>', <%= aggregateType %>StateBuilder)
class <%= aggregateType %> {

  constructor(private readonly state: <%= aggregateType %>State) {
  }

  create(<%= aggregateTypeSlug %>Id: string) {
      return [new <%= aggregateType %>Created(<%= aggregateTypeSlug %>Id)];
  }

  start(<%= aggregateTypeSlug %>Id: string) {
      return [new <%= aggregateType %>Started(<%= aggregateTypeSlug %>Id)];
  }

}

export {<%= aggregateType %>}
