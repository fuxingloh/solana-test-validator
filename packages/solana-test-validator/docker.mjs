import { spawn } from 'node:child_process';

/**
 * Get latest GitHub release from solana-labs/solana
 * @return {Promise<string>}
 */
async function getLatestTag() {
  const response = await fetch('https://api.github.com/repos/solana-labs/solana/releases/latest');
  const { tag_name } = await response.json();
  if (tag_name.match(/^v[0-9]+\.[0-9]+\.[0-9]+$/)) {
    return tag_name.replace(/^v/, '');
  }
  throw new Error(`Unexpected tag_name: ${tag_name}`);
}

async function run(version, type) {
  const args = [
    'buildx',
    'build',
    '.',
    '--progress=plain',
    '-t',
    `ghcr.io/fuxingloh/solana-test-validator:${version}`,
    '--build-arg',
    `SOLANA_VERSION=${version}`,
    '--cache-from',
    'type=registry,ref=ghcr.io/fuxingloh/solana-test-validator:build-cache',
  ];

  if (type === 'push') {
    args.push(
      '-t',
      'ghcr.io/fuxingloh/solana-test-validator:latest',
      '--output',
      'type=registry',
      '--platform',
      'linux/amd64,linux/arm64',
      '--cache-to',
      'type=registry,ref=ghcr.io/fuxingloh/solana-test-validator:build-cache',
    );
  }

  spawn('docker', args, { stdio: 'inherit' });
}

const tag = await getLatestTag();
await run(tag, process.argv[2]);
