/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Icon,
  Form,
  Input,
  Message,
  Divider,
  Button,
} from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Info } from "./consts";

const Chat = ({
  socket,
  username,
  room,
  setShowChat,
  usersQuantity,
  setUsersQuantity,
}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = new Info(currentMessage, room, true, username);
      await socket.emit("send_message", info);
      setMessageList((messages) => [...messages, info]);
      setCurrentMessage("");
    }
  };

  const disconnectFromRoom = async () => {
    const info = new Info(`${username} saiu da sala`, room, false);
    await socket.emit("leaveRoom", info);
    setShowChat(false);
  };


  useEffect(() => {
    const handleMessage = (data) => {
      setMessageList((messages) => [...messages, data]);
    };
    const handleQuantityOfUsers = (data) => {
      setUsersQuantity(data);
    };
    socket.on("receive_message", handleMessage);
    socket.on("userQuantity", handleQuantityOfUsers);
  }, [socket, setUsersQuantity]);

  return (
    <Container>
      <Card fluid>
        <Card.Content header={`Sala ${room}`} />
        <ScrollToBottom>
          <Card.Content style={{ height: "500px", padding: "5px" }}>
            {messageList.map((m, i) => {
              const verifyAuthor = username === m.author;
              return (
                <span key={i}>
                  <Message
                    style={{ textAlign: verifyAuthor ? "right" : "left" }}
                    warning={!m.userOn}
                    success={verifyAuthor}
                    info={!verifyAuthor}
                  >
                    <Message.Header key={i}>{m.message}</Message.Header>
                    <p>
                      <strong>{m.author ? m.author : ""}</strong>
                      <i> ás {m.time}h</i>
                    </p>
                  </Message>
                  <Divider />
                </span>
              );
            })}
          </Card.Content>
        </ScrollToBottom>
        <Card.Content extra>
          <Form>
            <Form.Field>
              <Input
                type="text"
                placeholder="Mensagem..."
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => (e.key === "enter" ? sendMessage : "")}
                action={{
                  color: "green",
                  icon: "send",
                  labelPosition: "right",
                  content: "Enviar",
                  onClick: sendMessage,
                }}
                value={currentMessage}
              />
            </Form.Field>
          </Form>
        </Card.Content>
        <Card.Content>
          <Icon name="user" />
          {usersQuantity}
        </Card.Content>
      </Card>
      <Button color={"red"} floated={"right"} onClick={disconnectFromRoom}>
        Desconectar da Sala
      </Button>
    </Container>
  );
};

export default Chat;
