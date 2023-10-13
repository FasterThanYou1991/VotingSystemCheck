/// <reference types="Cypress" />
const DataProcessor = require('../classes/DataProcessor');
const PageNavigator = require('../classes/PageNavigator');

class TestExecutor {
    constructor() {
        this.collectedData = [];
        this.dataProcessor = new DataProcessor();
        this.pageNavigator = new PageNavigator(this.dataProcessor);
    }

    executeTest() {
        describe('voting test', () => {
            
            it('should open gov.pl site, and gather all data connect to politician partys about voting', () => {
            this.pageNavigator.visitLinksAndGatherData('https://www.sejm.gov.pl/sejm9.nsf/agent.xsp?symbol=listaglos&IdDnia=1970', this.collectedData);
            });
            
            after(() => {
                this.dataProcessor.analyzeCollectedData(this.collectedData);
            });
        });
    }
}

const testExecutor = new TestExecutor();
testExecutor.executeTest();
