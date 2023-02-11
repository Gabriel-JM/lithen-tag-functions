import { ref } from '@/html'
import { applyRef } from '@/html/apply-ref'

describe('applyRefs', () => {
  it('should apply the correct element reference to the ref object', () => {
    const elementRef = ref()
    const template = document.createElement('template')
    template.innerHTML = `<div ref="ref-0"><p>Text</p></div>`
    const docFrag = template.content

    const div = docFrag.querySelector('div')

    applyRef(docFrag, 'ref="ref-0"', elementRef)

    expect(elementRef.el).toEqual(div)
    expect(div?.getAttribute('ref')).toBeNull()
  })
})
