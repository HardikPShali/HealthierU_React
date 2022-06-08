import React from "react";
import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import quesJson from "./questions.json";
import { Questions } from "./Questions";
import "../patient.css";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "universal-cookie";
import { postHealthAssessment } from "../../../service/frontendapiservices";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { ScoreSharp } from "@material-ui/icons";

const Questionnaire = ({ match }) => {
  const [questions, setQuestions] = useState([]);
  const isNew = match.params.new;

  const [continueClick, setContinueClick] = useState(false);
  const [totalscore, settotalScore] = useState(0);
  const [healthAssess, setHealthAssess] = useState("");

  // const [loading, setLoading] = useState(true);

  const cookies = new Cookies();

  const currentPatient = cookies.get("profileDetails");
  const patientID = currentPatient.id;
  console.log(patientID);

  const history = useHistory();

  const handleAssessmentSubmit = async () => {
    const submitData = {
      selections: questions.map((question) => {
        if (!Array.isArray(question.answers)) {
          question.answers = [question.answers];
        }
        let score = 0;

        question.answers.forEach((answer) => {
          let choiceIndex = question.choices.indexOf(answer);
          if (choiceIndex > -1) {
            score += question.mapScore[choiceIndex];
          }

          // score += question.mapScore[choiceIndex]
        });

        question.score = score;
        return question;
      }),
      totalScore: questions.reduce(
        (total, question) => total + question.score,
        0
      ),
    };
    console.log("submitData.totalScore", submitData.totalScore);
    const response = await postHealthAssessment(
      isNew === "new" ? "post" : "put",
      submitData,
      patientID
    ).catch((err) => {
      console.log(err);
    });
    console.log(response);
    settotalScore(submitData.totalScore);

    // toast.success(`You are ${healthBehavior}`, {
    //   position: 'top-right',
    //   autoClose: 2000,
    //   hideProgressBar: true,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    // });
  };

  const healthBehaviorOnScore = (score) => {
    if (score <= 3) {
      setHealthAssess("not Healthy");
      console.log("not healthy", healthAssess);
      return healthAssess;

      // return 'not Healthy';
    } else if (score > 3 && score <= 7) {
      setHealthAssess("moderately Healthy");
      console.log("mod healthy", healthAssess);
      return healthAssess;

      // return 'moderately Healthy';
    } else {
      setHealthAssess("Healthy");
      console.log(" healthy", healthAssess);
      return healthAssess;

      // return 'Healthy';
    }
  };

  useEffect(() => {
    healthBehaviorOnScore(totalscore);
  }, [totalscore]);

  const onContinue = async () => {
    console.log(questions);
    if (questions.length > 0) {
      handleAssessmentSubmit();
      if (handleAssessmentSubmit()) {
        setContinueClick(true);
        // healthBehaviorOnScore(totalscore);
      }
      // history.push('/patient');
    } else {
      toast.error("Please fill the form!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      history.reload();
    }
  };

  const handleFollowQuestionsCondition = () => {
    console.log("Something");
    questions.forEach((question) => {
      if (question.condition) {
        const previousQuestion = questions.find(
          (q) => q.questionId === question.condition.questionId
        );
        if (previousQuestion.answers) {
          if (previousQuestion.answers === question.condition.answer) {
            console.log("HIDDEN");
            question.hidden = true;
          } else {
            question.hidden = false;
          }
          setQuestions([...questions]);
        }
        // setQuestions({ ...questions });
      }
    });
  };

  useEffect(() => {
    setQuestions(quesJson);
  }, []);

  useEffect(() => {
    console.log("Something");
  }, [questions]);

  const closeDialog = () => {
    setContinueClick(false);
    history.push("/patient");
  };

  return (
    <div className="container-fluid">
      <Row id="questionnaire-view" style={{ minHeight: "600px" }}>
        <Col md={6} id="questionnaire-view-bg"></Col>
        <Col
          md={6}
          style={{ background: "#fff", padding: "2% 0 2% 2%" }}
          className="questionnaire-container"
        >
          <div className="questionnaire-header">
            <h1>Health Assessment</h1>
          </div>
          <div className="question-box scroller-cardlist">
            {questions &&
              questions.map((question) => (
                <Questions
                  followQuestion={handleFollowQuestionsCondition}
                  key={question.questionId}
                  question={question}
                />
              ))}
          </div>
          <div className="questionnaire-continue-button">
            <Button
              type="submit"
              variant="primary"
              className="w-100 Questionnaire-Continue-Button"
              onClick={onContinue}
            >
              Continue
            </Button>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Col>
      </Row>

      <Dialog
        onClose={closeDialog}
        aria-labelledby="customized-dialog-title"
        open={continueClick}
      >
        <DialogTitle id="customized-dialog-title" onClose={closeDialog}>
          Assessment Based on Score
        </DialogTitle>

        <DialogContent>
          <div className="score-text">
            <span
              style={{
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              You scored {totalscore}
            </span>
            <h5>You are {healthAssess}</h5>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="score-modal-btn-wrapper">
            <button
              autoFocus={false}
              onClick={closeDialog}
              className="btn btn-primary"
              id="close-btn"
            >
              OK
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Questionnaire;
