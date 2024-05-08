// Content Extraction
export const getDefaultContents = (data: string) => {
  const regex = /```([\s\S]*?)```/g
  const match = regex.exec(data)
  return match ? match[1].trim() : null
}

export const getCssContents = (data: string) => {
  const regex = /```css([\s\S]*?)```/g
  const match = regex.exec(data)
  return match ? match[1].trim() : null
}

export const getJsContents = (data: string) => {
  const regex = /```js([\s\S]*?)```/g
  const match = regex.exec(data)
  return match ? match[1].trim() : null
}

export const getJsonContents = (data: string) => {
  const regex = /```json([\s\S]*?)```/g
  const match = regex.exec(data)
  return match ? match[1].trim() : ''
}

export const getHtmlContents = (data: string) => {
  const regex = /```html([\s\S]*?)```/g
  const match = regex.exec(data)
  return match ? match[1].trim() : ''
}

export const getPhpContents = (data: string, ensurePhpTags = false) => {
  let regex = /```php([\s\S]*?)```/g
  let match = regex.exec(data)

  if (!match) {
    regex = /```html([\s\S]*?)```/g
    match = regex.exec(data)
  }

  let result = match ? match[1].trim() : null
  if (!result) {
    return null
  }

  if (ensurePhpTags) {
    if (!result.trim().startsWith('<?php')) {
      result = `<?php\n${result}`
    }
    if (!result.trim().endsWith('?>')) {
      result = `${result}\n?>`
    }
  }

  return result
}

export const getStyleFileContents = (data: string) => {
  const regex = /\[style\.css\]([\s\S]*?)\[\/style\.css\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  return getCssContents(response)
}

export const getScriptFileContents = (data: string) => {
  const regex = /\[script\.js\]([\s\S]*?)\[\/script\.js\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  return getJsContents(response)
}

export const getFunctionsFileContents = (data: string) => {
  const regex = /\[functions\.php\]([\s\S]*?)\[\/functions\.php\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  const phpData = getPhpContents(response)
  const htmlData = phpData ?? getHtmlContents(response)
  return htmlData ?? getDefaultContents(response)
}

export const getIndexFileContents = (data: string) => {
  const regex = /\[index\.php\]([\s\S]*?)\[\/index\.php\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  const phpData = getPhpContents(response)
  const htmlData = phpData ?? getHtmlContents(response)
  return htmlData ?? getDefaultContents(response)
}

export const getHeaderFileContents = (data: string) => {
  const regex = /\[header\.php\]([\s\S]*?)\[\/header\.php\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  const phpData = getPhpContents(response)
  const htmlData = phpData ?? getHtmlContents(response)
  return htmlData ?? getDefaultContents(response)
}

export const getFooterFileContents = (data: string) => {
  const regex = /\[footer\.php\]([\s\S]*?)\[\/footer\.php\]/g
  const match = regex.exec(data)
  const response = match ? match[1].trim() : null
  if (!response) {
    return null
  }

  const phpData = getPhpContents(response)
  const htmlData = phpData ?? getHtmlContents(response)
  return htmlData ?? getDefaultContents(response)
}

export const getContentType = (extension: string) => {
  let contentType
  switch (extension) {
    case 'css':
      contentType = 'text/css'
      break
    case 'js':
      contentType = 'text/javascript'
      break
    case 'php':
      contentType = 'text/php'
      break
    case 'html':
      contentType = 'text/html'
      break
    default:
      contentType = 'text/html'
  }

  return contentType
}
