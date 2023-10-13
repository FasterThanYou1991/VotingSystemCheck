class DataProcessor{
    processRow(row) {
        const cells = row.find('td');
        const partyName = cells.eq(0).text().trim();
        const totalMembers = cells.eq(1).text().trim();
        const voted = cells.eq(2).text().trim();
        const forVotes = cells.eq(3).text().trim() || "0";  // Jeżeli brak danych, przyjmujemy 0
        const againstVotes = cells.eq(4).text().trim() || "0";  // Jeżeli brak danych, przyjmujemy 0
        const abstained = cells.eq(5).text().trim() || "0";  // Jeżeli brak danych, przyjmujemy 0
        const notVoted = cells.eq(6).text().trim() || "0";  // Jeżeli brak danych, przyjmujemy 0
        
        return {
            partyName,
            totalMembers,
            voted,
            forVotes,
            againstVotes,
            abstained,
            notVoted
        };
    };
    findPartiesVotedFor(partiesData) {
        return partiesData.filter(party => parseInt(party.forVotes) > 0);
    }
    findPartiesVotedAgainst(partiesData) {
        return partiesData.filter(party => parseInt(party.againstVotes) > 0);
    }

    analyzeCollectedData(collectedData) {
        const totalVotings = collectedData.length;
    
        // Lista partii do porównania z PiS
        const partiesToCheck = ['Konfederacja', 'KO', 'Lewica', 'KP', 'Polska2050'];
        const result = {};
        
        partiesToCheck.forEach(party => {
            // Pomijamy porównanie 'PiS' z 'PiS'
            if (party === 'PiS') return;
    
            result[party] = {
                for: 0,
                against: 0
            };
    
            collectedData.forEach(data => {
                const partiesVotedFor = data.partiesThatVotedFor.map(party => party.partyName);
                const partiesThatVotedAgainst = data.partiesThatVotedAgainst.map(party => party.partyName);
    
                if (partiesVotedFor.includes(party) && partiesVotedFor.includes('PiS')) {
                    result[party].for += 1;
                }
                if (partiesThatVotedAgainst.includes(party) && partiesThatVotedAgainst.includes('PiS')) {
                    result[party].against += 1;
                }

            });
        });
    
        // Wydrukowanie wyników
        cy.log('Wyniki głosowań:');
        for (let party in result) {
            cy.log(`${party} głosowało razem z PiS Za ${result[party].for} razy, Przeciw ${result[party].against} razy.`);
        }
    }
}; 
module.exports = DataProcessor;