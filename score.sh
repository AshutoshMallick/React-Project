npm install 
rm -rf ./test-report.xml && CI=true ./node_modules/.bin/react-scripts test --verbose --env=jsdom --testResultsProcessor ./node_modules/jest-junit-reporter;
cd Backend/
npm install
sh dbinstall.sh
rm -rf ./test-report.xml && npm test;
cd ..
npx junit-merge 'test-report.xml' 'Backend/test-report.xml'