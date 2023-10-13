class PageNavigator {

    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
    };

    processAndGoBack(link, index, collectedData) {
        cy.visit(link);

        cy.get('table.kluby tbody tr').then(rows => {
            const partiesData = Array.from(rows, row => this.dataProcessor.processRow(Cypress.$(row)));
            const partiesThatVotedFor = this.dataProcessor.findPartiesVotedFor(partiesData);
            const partiesThatVotedAgainst = this.dataProcessor.findPartiesVotedAgainst(partiesData);

            // Zapisz dane o partii, która głosowała "Za", a która "Przeciw"
            collectedData.push({
                link,
                index,
                partiesThatVotedFor,
                partiesThatVotedAgainst
            });

            cy.log('Partie, które głosowały Za: ', partiesThatVotedFor.map(party => party.partyName).join(', '));
        });

        cy.go('back');
    };
    visitLinksAndGatherData(url, collectedData) {
        cy.visit('https://www.sejm.gov.pl/sejm9.nsf/agent.xsp?symbol=listaglos&IdDnia=1970');
        cy.get('table tbody tr td a').each((anchor, index) => {
            const getFullLink = href => 'https://www.sejm.gov.pl/sejm9.nsf/' + href;
            const fullLink = getFullLink(anchor.attr('href'));
            this.processAndGoBack(fullLink, index, collectedData);
        });
    }
};
module.exports = PageNavigator;