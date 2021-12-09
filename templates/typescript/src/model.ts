import {DomainEvent, EventHandler, Aggregate} from "@serialized/serialized-client";

class <%= aggregateType %>State {
  readonly <%= aggregateTypeSlug %>Id?: string;
  readonly status?: string;
}

class <%= aggregateType %>Created {
  constructor(readonly <%= aggregateTypeSlug %>Id: string) {
  };
}

class <%= aggregateType %>Started {
  constructor(readonly <%= aggregateTypeSlug %>Id: string) {
  };
}

class <%= aggregateType %>StateBuilder {

  get initialState() : <%= aggregateType %>State {
    return {status: 'undefined'}
  }

  @EventHandler(<%= aggregateType %>Created)
  handle<%= aggregateType %>Created(state: <%= aggregateType %>State, event: DomainEvent<<%= aggregateType %>Created>): <%= aggregateType %>State {
    return {<%= aggregateTypeSlug %>Id: state.<%= aggregateTypeSlug %>Id, status: 'created'};
  }

  @EventHandler(<%= aggregateType %>Started)
  handle<%= aggregateType %>Started(state: <%= aggregateType %>State, event: DomainEvent<<%= aggregateType %>Created>): <%= aggregateType %>State {
    return {<%= aggregateTypeSlug %>Id: state.<%= aggregateTypeSlug %>Id, status: 'started'};
  }

}

@Aggregate('<%= aggregateTypeSlug %>', <%= aggregateType %>StateBuilder)
class <%= aggregateType %> {

  constructor(private readonly state: <%= aggregateType %>State) {
  }

  create(<%= aggregateTypeSlug %>Id: string) {
      return [DomainEvent.create(new <%= aggregateType %>Created(<%= aggregateTypeSlug %>Id))];
  }

  start(<%= aggregateTypeSlug %>Id: string) {
      if(this.state.status === 'created') {
        return [DomainEvent.create(new <%= aggregateType %>Started(<%= aggregateTypeSlug %>Id))];
      } else {
        throw new Error('<%= aggregateType %> has not been started')
      }
  }

}

export {<%= aggregateType %>, <%= aggregateType %>State, <%= aggregateType %>Created, <%= aggregateType %>Started}
