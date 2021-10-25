import process from 'child_process';

process.exec('npm ls typescript', (_, stdout) => {
  console.log(stdout.toString());
});
