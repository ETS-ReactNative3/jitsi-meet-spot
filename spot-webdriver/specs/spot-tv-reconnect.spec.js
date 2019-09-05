const spotSessionStore = require('../user/spotSessionStore');

describe('The reconnect logic', () => {
    const session = spotSessionStore.createSession();

    describe('when the internet goes offline', () => {
        it('in the backend mode Spot TV and permanent remote will both reconnect', () => {
            if (!session.isBackendEnabled()) {
                pending();

                return;
            }

            session.startSpotTv();
            session.startPermanentSpotRemote();

            const tv = session.getSpotTV();
            const remote = session.getSpotRemote();

            tv.setNetworkOffline();
            remote.setNetworkOffline();

            tv.getLoadingScreen().waitForLoadingToAppear();
            remote.getLoadingScreen().waitForLoadingToAppear();

            tv.setNetworkOnline();
            remote.setNetworkOnline();

            remote.getLoadingScreen().waitForLoadingToDisappear();

            // Spot TV needs more time, because of the MUC JID conflict
            tv.getLoadingScreen().waitForLoadingToDisappear(90 * 1000);
        });
        it('Spot TV will reconnect, but temporary remote will go back to the join code entry page', () => {
            const tv = session.getSpotTV();
            const remote = session.getSpotRemote();

            session.connectRemoteToTV();

            tv.setNetworkOffline();
            remote.setNetworkOffline();

            tv.getLoadingScreen().waitForLoadingToAppear();

            // Temporary remote is supposed to go back to the join code entry page
            remote.getJoinCodePage().waitForVisible(30 * 1000);

            tv.setNetworkOnline();
            remote.setNetworkOnline();

            // Spot TV needs more time, because of the MUC JID conflict
            tv.getLoadingScreen().waitForLoadingToDisappear(90 * 1000);
        });
    });
});