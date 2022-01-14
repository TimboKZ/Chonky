describe('Drag and Drop tests', () => {
  it('Can drag file into a folder', () => {
    cy.visit('/iframe.html?id=basics-fullfilebrowser--with-files-and-folders&args=&viewMode=story', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      },
    });
    function midpointCallback(dragSelector, dropSelector) {
      cy.wait(5000);
      cy.get(dragSelector).should('exist');
    }
    dragAndDrop('[data-chonky-file-id="mwq"]', '[data-chonky-file-id="lht"]', midpointCallback);
  });

  it('Cannot drag folder into a file', () => {
    cy.visit('/iframe.html?id=basics-fullfilebrowser--with-files-and-folders&args=&viewMode=story', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'log').as('consoleLog');
      },
    });
    function midpointCallback(dragSelector, dropSelector) {
      cy.wait(5000);
      cy.get(dragSelector).should('exist');
    }
    dragAndDrop('[data-chonky-file-id="lht"]', '[data-chonky-file-id="mwq"]', midpointCallback);
  });
});

function dragAndDrop(
  dragSelector,
  dropSelector,
  { beforeCallback = null, midpointCallback = null, afterCallback = null },
) {
  // Based on this answer: https://stackoverflow.com/a/55436989/3694288
  cy.get(dragSelector).should('exist');
  cy.get(dropSelector).should('exist');

  if (beforeCallback) beforeCallback(dragSelector, dropSelector);
  cy.wait(500);
  cy.get(dragSelector).parent().parent().trigger('dragstart');
  cy.wait(500);
  if (midpointCallback) midpointCallback(dragSelector, dropSelector);
  cy.get(dropSelector).parent().parent().trigger('dragover');
  cy.wait(500);
  cy.get(dropSelector).parent().parent().trigger('dragend');
  if (afterCallback) afterCallback(dragSelector, dropSelector);
}
