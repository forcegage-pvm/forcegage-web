import { observable, action, decorate, computed } from 'mobx';

export class State {
  menuSelected = false;
  menuParent = 'overview';
  menuSelectedKeys = ['overview'];
  menuOpen = 'exercises';
  menuChild = '';
  athletesLoading = true;
  athleteLoading = true;
  loggedIn = false;
  activeMenuItem = 'login';
}

decorate(State, {
  menuSelected: observable,
  menuParent: observable,
  menuSelectedKeys: observable,
  menuChild: observable,
  athletesLoading: observable,
  athleteLoading: observable,
  activeMenuItem: observable,
  loggedIn: observable
});
