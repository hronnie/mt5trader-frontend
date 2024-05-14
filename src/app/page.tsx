import { Button, Col, Container, Row } from "react-bootstrap";

export default function Home() {
    return     <Container>
        <Row>
            <Col>
                <h1 className="text-danger fw-bold">Home</h1>
                <Button variant="primary" className="mt-5 ">Click Me</Button>
            </Col>
        </Row>
    </Container>
}
