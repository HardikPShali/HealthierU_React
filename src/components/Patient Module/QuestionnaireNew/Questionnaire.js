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
import TransparentLoader from '../../Loader/transparentloader';
import { ScoreSharp } from "@material-ui/icons";

const Questionnaire = ({ match }) => {
  const [questions, setQuestions] = useState([]);
  const isNew = match.params.new;

  const [continueClick, setContinueClick] = useState(false);
  const [totalscore, settotalScore] = useState(0);
  const [healthAssess, setHealthAssess] = useState("");
  const cookies = new Cookies();

  const currentPatient = cookies.get("profileDetails");
  const patientID = currentPatient.id;

  const history = useHistory();

  const isAnswerEmpty = (question) => {
    let isInvalid;
    if (question.type === 'checkbox') {
      isInvalid = question.answers.length == 0;
    } else {
      isInvalid = question.answers === "";
    }

    if (isInvalid) {
      question.isError = true;
    } else {
      question.isError = false
    }

    return isInvalid
  }

  const handleValidation = () => {
    questions.forEach((question) => {
      if (question.condition) {
        const previousQuestion = questions.find(
          (q) => q.questionId === question.condition.questionId
        );

        if (previousQuestion.answers === question.condition.answer) {
          question.isError = false;
          return false;
        } else {
          isAnswerEmpty(question)
        }
      } else {
        isAnswerEmpty(question)
      }


    })

    setQuestions([...questions])
    return questions.some((question) => question.isError)
  }

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
    const response = await postHealthAssessment(
      isNew === "new" ? "post" : "put",
      submitData,
      patientID
    ).catch((err) => {
      console.log(err);
    });
    settotalScore(submitData.totalScore);
  };

  const healthBehaviorOnScore = (score) => {
    setHealthAssess('');
    if (score === 0) {
      setHealthAssess('');
      return healthAssess;
    }
    else if (score > 0 && score <= 3) {
      setHealthAssess("not Healthy");

      return healthAssess;


      // return 'not Healthy';
    } else if (score > 3 && score <= 7) {
      setHealthAssess("moderately Healthy");

      return healthAssess;

      // return healthAssess;

      // return 'moderately Healthy';
    } else {
      setHealthAssess("Healthy");

      return healthAssess;

      // return healthAssess;

      // return 'Healthy';
    }
  };

  useEffect(() => {
    setTimeout(() => {
      healthBehaviorOnScore(totalscore);
    }, 2000)

  }, [totalscore]);

  const onContinue = async () => {
    const isInvalid = handleValidation();
    if (isInvalid) {
      window.scrollTo(0, 0);
      toast.error("Please answer all the questions", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (questions.length > 0) {
      handleAssessmentSubmit();
      setContinueClick(true);

      // healthBehaviorOnScore(totalscore);

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
    questions.forEach((question) => {
      if (question.condition) {
        const previousQuestion = questions.find(
          (q) => q.questionId === question.condition.questionId
        );
        if (previousQuestion.answers) {
          if (previousQuestion.answers === question.condition.answer) {
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
    questions.forEach((question) => {
      question.isError = false
    })
  }, [questions]);

  const closeDialog = () => {
    setContinueClick(false);
    if (isNew === 'new') {
      history.push("/patient");
    }
    else {
      history.push("/patient/mydoctor");
    }
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
                  isError={question.isError}
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
              {/* You scored {totalscore} */}
            </span>
            {
              healthAssess ? <h5>You are {healthAssess}</h5> : <h6>Loading assessment...</h6>
            }

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
              Connect with an Expert
            </button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Questionnaire;
