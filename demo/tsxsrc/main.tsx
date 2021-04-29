import HelloComponent from './Hello';

declare interface ITestComponent {
  name: string;
  component: JSX.Element;
}

export default (): ITestComponent => {
  return {
    name: 'charlesmoone',
    component: <HelloComponent />,
  };
};
