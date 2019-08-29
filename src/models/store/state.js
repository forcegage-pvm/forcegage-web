import { observable, action, decorate, computed } from 'mobx';

export class State {
  menuParent = 'overview';
  menuChild = '';
}

decorate(State, {
  menuParent: observable,
  menuChild: observable
});
