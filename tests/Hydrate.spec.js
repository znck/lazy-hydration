import Vue from 'vue'
import { renderToString } from '@vue/server-test-utils'
import { shallowMount } from '@vue/test-utils'
import Hydrate from '../Hydrate'

function createComponent(onHydration) {
  return {
    mounted() {
      onHydration && onHydration()
    },
    render(h) {
      return h('p', ['Some content!'])
    },
  }
}

function getSlot(fn) {
  return {
    slots: { default: createComponent(fn) },
  }
}

it('hydrates if no server rendered content is found', done => {
  const fn = jest.fn()
  const wrapper = shallowMount(Hydrate, getSlot(fn))

  expect(wrapper.html()).not.toEqual(
    expect.stringContaining('<p>Some content!</p>')
  )

  Vue.nextTick(() => {
    expect(wrapper.html()).toEqual(
      expect.stringContaining('<p>Some content!</p>')
    )

    done()
  })
})

// TODO: Test hydration.