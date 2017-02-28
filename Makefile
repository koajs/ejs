TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 5000
MOCHA_OPTS =
NPM_INSTALL = npm install --registry=https://registry.npm.taobao.org --cache=${HOME}/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist
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

.PHONY: test
