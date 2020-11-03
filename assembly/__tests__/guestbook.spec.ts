import { addMessage, getMessages } from '../main'
import { PostedMessage, messages } from '../model'


function createMessage (text: string): PostedMessage {
  return new PostedMessage(text);
}

const hello: string = 'hello world'
const message = createMessage(hello)

describe('messages should be able to', () => {
  beforeEach(()  => {
    addMessage(hello)
  });

  afterEach( () => {
    while (messages.length > 0) {
      messages.pop()
    }
  })

  it('add a message', () => {
    expect(messages.length).toBe(1, 'should only contain one message')
    expect(messages[0]).toStrictEqual(message, 'message should be "hello world"')
  })

  it('retrive messages', () => {
    const messagesArr = getMessages()
    expect(messagesArr.length).toBe(1, 'should be one message')
    expect(messagesArr).toIncludeEqual(message, 'messages should include:\n' + message.toJSON())
    log(messagesArr[0])
  })

  it('only show the last ten messages', () => {
    const newMessages: PostedMessage[] = []
    for (let i: i32 = 0; i < 10; i++) {
      const text = 'message #' + i.toString()
      newMessages.push(createMessage(text))
      addMessage(text)
    }
    const messages = getMessages()
    log(messages.slice(7, 10))
    expect(messages).toStrictEqual(newMessages, 'should be the last ten mesages')
    expect(messages).not.toIncludeEqual(message, "shouldn't contain the first element")
  })
})
