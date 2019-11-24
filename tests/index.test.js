const Octokit = require('@octokit/rest');
const nock = require('nock');

nock.disableNetConnect();

beforeEach(() => {
   nock.cleanAll();
   jest.setTimeout(10000);
   nockAccessToken();
});

function nockAccessToken () {
   nock('https://api.github.com')
       .post('/app/installations/1296032/access_tokens')
       .reply(200, { token: 'test' });
}

test('hanging nock request', async () => {
   const octokit = Octokit();
   const user = await octokit.users.getByUsername({
      username: 'robvanderleek'
   });
   console.log(user);
});