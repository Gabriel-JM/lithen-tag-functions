import { placeElements } from '@/html/place-elements'

function generateDocFragment(htmlContent: string) {
  const template = document.createElement('template')
  template.innerHTML = htmlContent

  return template.content
}

describe('placeElements', () => {
  it('should return if target element does not have any placeholder element', () => {
    const targetElement = document.createElement('div')
    const queryResult = {
      length: 0,
      forEach() {}
    }

    const forEachSpy = vi.spyOn(queryResult, 'forEach')
    const querySelectorAllSpy = vi.spyOn(targetElement, 'querySelectorAll')
    querySelectorAllSpy.mockReturnValueOnce(queryResult as unknown as NodeListOf<Element>)

    placeElements(targetElement, new Map())

    expect(forEachSpy).not.toHaveBeenCalled()
  })

  it('should get all elements from array and append the corresponding elements on the parent element', () => {
    const template = document.createElement('template')
    template.innerHTML = '<template elm-id="elm-0"></template>'

    const targetElement = template.content

    const elementsMap = new Map([
      ['elm-id="elm-0"', [document.createElement('div'), '<p>Injected</p>'] as Node[]]
    ])

    const querySelectorSpy = vi.spyOn(targetElement, 'querySelector')

    placeElements(targetElement, elementsMap)

    const childDiv = targetElement.querySelector('div')
    const childTemplate = targetElement.querySelector('template')

    expect(querySelectorSpy).toHaveBeenCalledWith('template[elm-id="elm-0"]')
    expect(childDiv).toEqual(elementsMap.get('elm-id="elm-0"')?.[0])
    expect(targetElement.childNodes[0]).toEqual(childDiv)
    expect(childTemplate).toBeNull()
    expect(targetElement.querySelector('p')).toBeNull()
  })

  it('should get a NodeList and append the corresponding elements on the parent element', () => {
    const parentElement = document.createElement('header')
    parentElement.innerHTML = `
      <span>any text</span>
      <template elm-id="elm-0"></template>
      <div>
        <template elm-id="elm-5"></template>
      </div>
    `

    const elementsMap = new Map([
      ['elm-id="elm-0"', generateDocFragment('<p>any paragraph</p>').childNodes],
      ['elm-id="elm-5"', generateDocFragment('<input />').childNodes]
    ])

    placeElements(parentElement, elementsMap)

    const childP = parentElement.querySelector('p')
    const childInput = parentElement.querySelector('input')

    expect(childP).toBeInstanceOf(HTMLParagraphElement)
    expect(childP?.parentElement).toEqual(parentElement)

    expect(childInput).toBeInstanceOf(HTMLInputElement)
    expect(childInput?.parentElement).toEqual(parentElement.querySelector('div'))
    
    expect(parentElement.querySelector('template[elm-id="elm-0"]')).toBeNull()
    expect(parentElement.querySelector('template[elm-id="elm-5"]')).toBeNull()
  })
})
