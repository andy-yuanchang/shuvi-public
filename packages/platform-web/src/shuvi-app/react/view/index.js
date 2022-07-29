import clientView from './clientView.js';
import serverView from './serverView.js';

const view = __BROWSER__ ? clientView : serverView;

export default view;
