TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 5000
MOCHA_OPTS =
NPM_INSTALL = npm install --registry=http://registry.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm --disturl=http://dist.u.qiniudn.com
install:
	@$(NPM_INSTALL)

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--require should \
		$(MOCHA_OPTS) \
		$(TESTS)

autod: install
	@./node_modules/.bin/autod -w -e example -f \
	-D mocha,should \
	-s ejs@1
	@$(MAKE) install

.PHONY: test
