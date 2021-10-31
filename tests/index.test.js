// const Octokit = require('@octokit/rest');
const nock = require('nock');
const {Probot, ProbotOctokit} = require('probot')
const checkSuitePayload = require('./check_suite.requested')

nock.disableNetConnect();

// test('1. correctly shows missing network mock', async () => {
//     nock('https://api.github.com').get('/some/endpoint').reply(404)
//
//     const octokit = Octokit();
//     const user = await octokit.users.getByUsername({
//         username: 'robvanderleek'
//     });
//     console.log(user);
// });

test('2. also works correctly due to no missing network mock', async () => {
    const probot = new Probot({
        appId: 1, //
        githubToken: 'test', // Disable throttling & retrying requests for easier testing
        Octokit: ProbotOctokit.defaults({
            retry: {enabled: false}, throttle: {enabled: false}
        })
    });
    const probotApp = (app) => {
        app.on(['check_suite.requested', 'check_run.rerequested'], check)

        async function check(context) {
            await context.config('issue-branch.yml', {})
        }
    };
    const app = probot.load(probotApp);
    app.app = {
        getInstallationAccessToken: () => Promise.resolve('test')
    };

    nock('https://api.github.com')
        .get('/repos/hiimbex/testing-things/contents/.github%2Fissue-branch.yml')
        .reply(404)
        .get('/repos/hiimbex/.github/contents/.github%2Fissue-branch.yml')
        .reply(404);

    await probot.receive({name: 'check_suite', payload: checkSuitePayload});
});

test('3. Correctly shows missing network mock', async () => {
    const probot = new Probot({
        appId: 1, //
        githubToken: 'test', // Disable throttling & retrying requests for easier testing
        Octokit: ProbotOctokit.defaults({
            retry: {enabled: false}, throttle: {enabled: false}
        })
    });
    const probotApp = (app) => {
        app.on(['check_suite.requested', 'check_run.rerequested'], check)

        async function check(context) {
            await context.config('issue-branch.yml', {})
        }
    };
    const app = probot.load(probotApp);
    app.app = {
        getInstallationAccessToken: () => Promise.resolve('test')
    }

    nock('https://api.github.com')
        .get('/repos/hiimbex/testing-things/contents/.github/issue-branch.yml')
        .reply(404);

    await probot.receive({name: 'check_suite', payload: checkSuitePayload})
});
