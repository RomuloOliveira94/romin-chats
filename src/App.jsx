import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { Container, Card, Form, Button, Header } from "semantic-ui-react";
import { Info } from "./consts";
const socket = io("https://romin-chats-backend.onrender.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [usersQuantity, setUsersQuantity] = useState("");


  const joinRoom = async () => {
    if (room != "" && username != "") {
      const info = new Info(`${username} entrou na sala`, room, true);
      socket.emit("join_room", info);
      setShowChat(true);
      console.log('entrou')
    }
  };

  return (
    <Container style={{ margin: "20px" }}>
      <Header as="h1" textAlign="center">
        Romin Chats
      </Header>
      <Header as="h2">Chat em tempo real, entre em uma sala.</Header>
      {!showChat ? (
        <Card fluid>
          <Card.Content header="Entrar no Chat" />
          <Card.Content>
            <Form>
              <Form.Field>
               <label>Nome</label>
                <input
                  placeholder="Nome"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Field>
              <Form.Field>
                <label>Sala</label>
                <input
                  type="number"
                  placeholder="Número"
                  onChange={(e) => setRoom(e.target.value)}
                />
              </Form.Field>
              <Button onClick={joinRoom} color="blue" fluid>
                Entrar
              </Button>
            </Form>
          </Card.Content>
        </Card>
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          setShowChat={setShowChat}
          usersQuantity={usersQuantity}
          setUsersQuantity={setUsersQuantity}
        />
      )}
    </Container>
  );
}

export default App;
