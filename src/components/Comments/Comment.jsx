import { useState } from "react";
import styled, { css } from "styled-components";
import TimeAgo from "../FeedBack/TimeAgo";
import commentApis from "../../apis/commentApis";
import UserProfileModal from "../UI/ModalSample/UserProfileModal";
import GlobalTextArea from "../UI/GlobalTextArea";
const Comment = ({ currentComment, cardId, setAllComments }) => {
  const { id, user, createdAt, contents, isMine, parentId } = currentComment;

  const isRootComment = parentId === null;
  const [isEdit, setIsEdit] = useState(false);
  const [updateContent, setUpdateContent] = useState(contents);
  const isUpdateTextareaDisabled = updateContent.length === 0;

  const [openProfileModal, setOpenProfileModal] = useState(false);

  const sendProfileModalHandler = (boolean) => {
    setOpenProfileModal(boolean);
  };
  const clickCancelEditHandler = () => {
    setUpdateContent(contents);
    return setIsEdit(false);
  };

  const clickUpdateHandler = () => {
    return setIsEdit(true);
  };
  const clickUpdatePostHandler = async (event) => {
    event.preventDefault();
    if (isUpdateTextareaDisabled) {
      alert("수정할 내용을 작성해주세요.");
      return;
    }

    let updateData = {};
    if (isRootComment) {
      updateData = {
        contents: updateContent,
        rootId: cardId,
        rootName: "interview",
      };
    } else {
      updateData = {
        contents: updateContent,
        rootId: parentId,
        rootName: "comment",
      };
    }

    try {
      const response = await commentApis.updateComment(updateData, id);
      setIsEdit(false);
      setAllComments(response.comments);
    } catch (err) {
      console.log("댓글 수정 오류", err);
    }
  };

  const clickDeleteHandler = async () => {
    try {
      const response = await commentApis.deleteComment(id);
      setAllComments(response.comments);
    } catch (err) {
      console.log("댓글 삭제 오류", err);
    }
  };

  return (
    <CommentContainer>
      <UserProfileModal
        img={user?.profileImageUrl}
        nickname={user?.nickname}
        githubLink={user?.githubLink}
        introduce={user?.introduce}
        setOpenProfileModal={sendProfileModalHandler}
        openProfileModal={openProfileModal}
        isMine={isMine}
      />
      <AuthorContainer>
        <div className="author_box">
          <div
            className="user_profile"
            onClick={() => setOpenProfileModal(true)}
          >
            <ProfileImg src={user?.profileImageUrl} />
            <div className="name_date">
              <span>{user?.nickname}</span>
              <TimeAgo timestamp={createdAt} />
            </div>
          </div>
          {isMine && (
            <div className="button_box">
              <button onClick={clickUpdateHandler}>수정</button>
              <button onClick={clickDeleteHandler}>삭제</button>
            </div>
          )}
        </div>
      </AuthorContainer>
      {isEdit ? (
        <ContentBox>
          <GlobalTextArea
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
            charLimit="256"
            rows="5"
            cols="80"
            placeholder="50자이내로 나를 표현해주세요."
          />
          <div className="cancel_box">
            <button onClick={clickCancelEditHandler}>취소</button>
            <button onClick={clickUpdatePostHandler}>수정</button>
          </div>
        </ContentBox>
      ) : (
        <ContentBox>
          <span className="contents">{contents}</span>
        </ContentBox>
      )}
    </CommentContainer>
  );
};

const CommentContainer = styled.div`
  padding: 12px;
`;

const ContentBox = styled.div`
  font-size: ${({ theme }) => theme.calRem(14)};
  line-height: 1.5;
  margin: 16px 0px;
  resize: none;
  overflow: auto;
  & .edit_box {
    margin-top: 8px;
    padding: 11px 16px;
    border: 1px solid rgba(130, 130, 130, 0.2);
    border-radius: 4px;
    width: 100%;
  }

  & .cancel_box {
    display: flex;
    justify-content: flex-end;
    button {
      font-size: ${({ theme }) => theme.calRem(12)};
    }
  }

  & .contents {
    /* width: 100%; */
    overflow: auto;
    word-break: break-all;
  }
`;

const AuthorContainer = styled.div`
  width: 100%;

  & .author_box {
    flex-grow: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .user_profile {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &:hover {
        transform: scale(1.02);
      }
      & > span {
        font-size: ${({ theme }) => theme.calRem(12)};
      }
    }
    & .name_date {
      display: flex;
      flex-direction: column;
      gap: 5px;
      span:first-child {
        font-size: ${({ theme }) => theme.calRem(14)};
        font-weight: ${({ theme }) => theme.fontWeight.semiExtraBold};
      }
      span:last-child {
        font-size: ${({ theme }) => theme.calRem(12)};
      }
    }
    & .button_box {
      display: flex;
      -webkit-box-align: center;
      align-items: center;

      button {
        font-size: ${({ theme }) => theme.calRem(12)};
      }
    }
  }
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 24px;
  height: 24px;
  margin-right: 5px;
`;

// const ScrapIcon = styled(FaTrash)`
//   ${({ theme }) => {
//     return css`
//       margin-left: 10px;
//       height: 100%;
//       font-size: ${theme.calRem(14)};
//       padding: 0;
//       color: ${theme.colors.lightGrey};
//       cursor: pointer;
//     `;
//   }}
// `;

export default Comment;
