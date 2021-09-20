# Changelog

## [0.11.0](https://www.github.com/uladkasach/declapract/compare/v0.10.3...v0.11.0) (2021-09-20)


### Features

* **apply:** add the apply command ([ac6b5ba](https://www.github.com/uladkasach/declapract/commit/ac6b5bac1e3a72eb0881b0add15529a4621d0213))
* **check:** enable checking project against a practice ([236b8dd](https://www.github.com/uladkasach/declapract/commit/236b8dd20a7bbfbd26736dff158bc53c5e8bc69d))
* **cli:** enable filtering plan and apply down to a specific file ([29a5cf4](https://www.github.com/uladkasach/declapract/commit/29a5cf47e71937c7ca9d5d4a454ed3abbe73b200))
* **compile:** enable compiling declarations directories to enable packaging with npm ([be4d220](https://www.github.com/uladkasach/declapract/commit/be4d220900ab9c113e1ec6ad879f4be500128492))
* **configs:** define and read declaration and usage configs ([6ccc6b4](https://www.github.com/uladkasach/declapract/commit/6ccc6b4943c2ba37dd7c11972d4447fe3d6af451))
* **declare:** enable declaring json file contains checks with check minVersion expressions ([60f0169](https://www.github.com/uladkasach/declapract/commit/60f016916e41296b46f518956816fe8d8912488a))
* **display:** sort plans by path with same order as vscode ([2bce603](https://www.github.com/uladkasach/declapract/commit/2bce603bd3d8adc87eff473276aa62c1ed654a3f))
* **dx:** fail fast if user typos 'bad-practices/' dir as 'bad-practice/' ([7265f56](https://www.github.com/uladkasach/declapract/commit/7265f56ed476d7f282737d1a8e71fb519d07c23d))
* **exports:** export nessesary types and declaration utils for usage in a real best-practices repo ([da098fb](https://www.github.com/uladkasach/declapract/commit/da098fbe535c75943549afd2c92e13326f223e58))
* **feedback:** log performance metrics and give feedback about which evaluations are slow ([373c40b](https://www.github.com/uladkasach/declapract/commit/373c40bf465f9178daa98ea184bbd5aad9218624))
* **fix:** add automatic fix for json contains property replacement ([ecb5b68](https://www.github.com/uladkasach/declapract/commit/ecb5b687bca9703a38cc91727ac1f2849bfe3be3))
* **fix:** automatically define a fix function for contains checks ([e36cd87](https://www.github.com/uladkasach/declapract/commit/e36cd874f2864b9bb0215340e8f25596fd23c42b))
* **fix:** automatically define a fix function for failed bad practice equals checks ([fc88193](https://www.github.com/uladkasach/declapract/commit/fc8819342d978b36a2a46df1ded94c65b17e3829))
* **fix:** json contains fix can now add new keys, just sticks them at the back of obj ([8094ef9](https://www.github.com/uladkasach/declapract/commit/8094ef920d8c0309415a76eba4d92f782cb3c455))
* **fix:** support custom fix function declarations ([90833a0](https://www.github.com/uladkasach/declapract/commit/90833a0cd60fadc7f1136fa96492573b573b0765))
* **init:** initialize based on sql-dao-generator; define readme ([f0db15f](https://www.github.com/uladkasach/declapract/commit/f0db15f228940b1bbb53a1bfd1716b57668784d5))
* **plan:** add the plan command ([8cbfdad](https://www.github.com/uladkasach/declapract/commit/8cbfdaddf8c8277c7569db4f3c3ba0af68f0b9bc))
* **read:** define how to read declarations and run checks per file ([f0b264c](https://www.github.com/uladkasach/declapract/commit/f0b264c8e2a43351a4bd74a6fe339e4c4fbd8103))
* **speed:** update glob library and ignore paths for 10x+ speed boost ([0bbdfef](https://www.github.com/uladkasach/declapract/commit/0bbdfef4cbdaf98fc1b26a3c710882cfa6f13980))
* **ssh:** enable referencing git repos for declarations ([c32ac4a](https://www.github.com/uladkasach/declapract/commit/c32ac4ad006a6e678286a643725e9764e56065ba))
* **usage:** enable load declarations from npm modules ([a6aeca9](https://www.github.com/uladkasach/declapract/commit/a6aeca9eb2c3f13795f7439b3c9c55f310e60721))
* **validate:** add the validate command ([0ae89eb](https://www.github.com/uladkasach/declapract/commit/0ae89eb07643cc68afc034b05694a5a8952b7ad6))
* **variables:** dereference variables used in declared file contents and support getVariables for custom checks ([5fde610](https://www.github.com/uladkasach/declapract/commit/5fde610863af5de3a16f13e6d642a44315917097))


### Bug Fixes

* **apply:** make sure that fixes are applied seqentially per file ([d9299ed](https://www.github.com/uladkasach/declapract/commit/d9299ed866b3ce907213a06acb3691727f03b3a1))
* **apply:** make sure that if even one check is fixable, practice is fixable and fix is applied on apply ([0738a30](https://www.github.com/uladkasach/declapract/commit/0738a30864503f14fa1d67149531994cfcd4158f))
* **compile:** skip .declapract.test.ts files from compiled output ([a9be32d](https://www.github.com/uladkasach/declapract/commit/a9be32dbbfd27f0b00ebd53108892cbf8cbadfc8))
* **context:** update declaredFileContents in context to already have variable expressions dereferenced ([72218f7](https://www.github.com/uladkasach/declapract/commit/72218f791a270492fa416f4efb2b875201c6e038))
* **declarations:** make sure that the default json contains fix can add nested desired key values ([3a40557](https://www.github.com/uladkasach/declapract/commit/3a405576467a4f4a1e4cf76e709771278d0f5e21))
* **eval:** enable derreferencing nested project variable expressions ([5f423bb](https://www.github.com/uladkasach/declapract/commit/5f423bbfb90ad03bc511bbb786900fc8fb0d755f))
* **evaluation:** ignore 'node_module/*' and '.declapract/*' files from glob path evaluation ([2bd91e8](https://www.github.com/uladkasach/declapract/commit/2bd91e8c709960f5db515b8935d31fa3ac837b52))
* **exports:** export FileCheckDeclarationInput from module ([391a8e8](https://www.github.com/uladkasach/declapract/commit/391a8e804cf34ae43d953445893167500c84b88e))
* **fix:** make sure json contains fixes write the _parsed_ declared contents when new file ([5d4af5e](https://www.github.com/uladkasach/declapract/commit/5d4af5ebf5270fadc32b015af629ee0e8f5c7747))
* ignored eval directories, string checks; also, improve output on file dne failure and processing ([8b1e7af](https://www.github.com/uladkasach/declapract/commit/8b1e7af0908209de37541977c3fe2077aeabc418))
* **imports:** enable esModuleInterop for imported .declapract.ts files ([f461775](https://www.github.com/uladkasach/declapract/commit/f4617756c09e3f9cd53593691cbd7fe1b3c54886))
* jest, upgrade to ts-jest that works with tsv4 ([4a795d5](https://www.github.com/uladkasach/declapract/commit/4a795d52915a4b4a09a5aaf35b3038c9b44f5d73))
* **tests:** ensure that project root dir in context doesnt fail snapshots ([1576b7d](https://www.github.com/uladkasach/declapract/commit/1576b7dfda6e008321b31417df269eff25bbc645))
* **tests:** get tests in sync with latest changes again ([a821604](https://www.github.com/uladkasach/declapract/commit/a821604e5d993dc0188dceab54558d9f83a05ec2))
* **tests:** unskip test reading declarations from npm module ([affcbe6](https://www.github.com/uladkasach/declapract/commit/affcbe639ad3d71bce6641283325aaf0fdbdce38))
* **tests:** update the tests to handle latest refactorings ([c1dbf11](https://www.github.com/uladkasach/declapract/commit/c1dbf112fa27ed3ac7e3abf93099d9ef7bc8a9cb))
* **usage:** dereference symbolic link directories to enable npm link testing of declarations in usage config ([9fcb2a9](https://www.github.com/uladkasach/declapract/commit/9fcb2a9197c04cc87516fb4acbc08ad03d9a15e1))
* **use:** make sure that declarations from npm modules are transpiled on import ([633670b](https://www.github.com/uladkasach/declapract/commit/633670be1af379c7f69108e8450b4fa2a05f4c1d))
* **variables:** add pollyfill for str.replaceAll, since not all tsconfigs will support it ([dc3ceae](https://www.github.com/uladkasach/declapract/commit/dc3ceae5a4bc2c353fac306283115e7fa0409b18))
* **write:** ensure always a newline at end of files ([9005a5f](https://www.github.com/uladkasach/declapract/commit/9005a5fa93835fa6b772c432021387f7afea914c))

### [0.10.3](https://www.github.com/uladkasach/declapract/compare/v0.10.2...v0.10.3) (2021-09-20)


### Bug Fixes

* **apply:** make sure that if even one check is fixable, practice is fixable and fix is applied on apply ([0738a30](https://www.github.com/uladkasach/declapract/commit/0738a30864503f14fa1d67149531994cfcd4158f))
* **write:** ensure always a newline at end of files ([9005a5f](https://www.github.com/uladkasach/declapract/commit/9005a5fa93835fa6b772c432021387f7afea914c))
