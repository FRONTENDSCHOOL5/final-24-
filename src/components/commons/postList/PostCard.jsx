import React, { useCallback, useRef, useState } from "react";

import noImg from "../../../img/no-image.png";
import DateFormate from "../../commons/dateFormat/DateFormat";
import heartIcon from "../../../img/icon-heart.svg";
import heartFillIcon from "../../../img/icon-heart-fill.svg";
import commentIcon from "../../../img/icon-message-circle.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { customAxios } from "../../../library/customAxios";
import { useContext } from "react";
import { AccountContext } from "../../../context/AccountContext";
import UserInfo from "../../commons/userInfo/UserInfo";
import {
  PostContents,
  PostButtonSpan,
  PostImg,
  PostImgBtn,
  PostImgBtnLi,
  PostImgBtnUl,
  PostImgLi,
  PostImgUl,
  PostImgWrapper,
  PostLi,
  PostText,
  PostLikeBtnIcon,
  PostCommentLinkIcon,
  PostLikeCommentBtns,
  PostLikeBtn,
  PostHeartCount,
  PostCommentLink,
  PostCommentCount,
} from "./postList.styles";

export default function PostCard({
  onClickButton,
  settingPostModalProps,
  closeModal,
  reFetchPostData,
  post,
  userData,
  isFeed, // post feed 페이지와 post profile 페이지 구분
  isPostDetail, // post 페이지와 postDetail 페이지 구분
  setPostData,
}) {
  const { account } = useContext(AccountContext) || "";
  const [activeButton, setActiveButton] = useState(0);

  const [heartCount, setHeartCount] = useState(post.heartCount);
  const [hearted, setHearted] = useState(post.hearted);

  // 서버에서 받아온 이미지는 문자열이기 때문에 배열로 바꿔줌
  const imgArray = post.image ? post.image.split(",") : [];
  // 이미지 슬라이드에서 transform 해주기 위해 ref 사용
  const ImgUlRef = useRef(null);
  const navigate = useNavigate();

  // 이미지 슬라이드를 위해 해당 이미지의 이미지 크기에 인덱스를 곱해 translateX 해줌
  const onClickSliderBtn = useCallback((e, idx) => {
    ImgUlRef.current.style.transform = `translateX(-${307 * idx}px)`;
    setActiveButton(idx);
  }, []);

  // 게시물 제거
  const onClickRemovePost = useCallback(async () => {
    try {
      await customAxios.delete(`post/${post.id}`);
      setPostData((prev) => prev.filter((prev) => prev.id !== post.id));
    } catch (error) {
      if (error.response.data.message) {
        alert(error.response.data.message);
        reFetchPostData();
      }
      console.log(error);
    }
  }, []);

  // 게시물 신고
  async function onClickReportPost() {
    try {
      const response = await customAxios.post(`post/${post.id}/report`);
      if (response.data.report) {
        alert("신고가 완료 되었습니다.");
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  }

  // 좋아요
  const onClickLike = useCallback(async () => {
    try {
      // feed 페이지라면 userData가 자신의 유저정보를 나타냄, 페이지의 경우에는 params가 존재할 경우 다른유저의 정보를 나타냄
      // 따라서 feed 페이지와  페이지의 조건문을 다르게 처리함
      // 페이지에서는 자기 자신의 account필요함으로  현재 자기 자신의 account가 저장되어있는 AccountContext에서 account 꺼내옴
      if (
        isFeed
          ? post.author.accountname === userData.accountname
          : post.author.accountname === account
      ) {
        alert("자신의 글을 좋아요 할 수 없습니다!");
        return;
      }
      if (hearted) {
        await customAxios.delete(`post/${post.id}/unheart`);
        setHeartCount((prev) => parseInt(prev) - 1);
        setHearted(false);
      } else {
        await customAxios.post(`post/${post.id}/heart`);
        setHeartCount((prev) => parseInt(prev) + 1);
        setHearted(true);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.message) {
        alert(error.response.data.message);
        reFetchPostData();
      }
    }
  }, [hearted]);

  // 더보기 버튼
  const onClickMore = useCallback(() => {
    if (post.author.accountname === account)
      if (!isPostDetail) {
        // post 모달창 버튼 props 지정
        settingPostModalProps([
          {
            name: "삭제",
            func: () => {
              onClickButton("정말 삭제하시겠습니까?", "삭제", async () => {
                closeModal();
                await onClickRemovePost();
              });
            },
          },
          {
            name: "수정",
            func: () => {
              closeModal();
              navigate(`/post/${post.id}/edit`);
            },
          },
          {
            name: "게시물 상세 페이지로 이동",
            func: () => {
              closeModal();
              navigate(`/post/${post.id}`);
            },
          },
        ]);
      } else {
        settingPostModalProps([
          {
            name: "삭제",
            func: () => {
              onClickButton("정말 삭제하시겠습니까?", "삭제", async () => {
                closeModal();
                await onClickRemovePost();
              });
            },
          },
          {
            name: "수정",
            func: () => {
              closeModal();
              navigate(`/post/${post.id}/edit`);
            },
          },
        ]);
      }
    else {
      if (!isPostDetail) {
        // post 모달창 버튼 props 지정
        settingPostModalProps([
          {
            name: "신고",
            func: () => {
              onClickButton("정말 신고 하시겠습니까?", "신고", async () => {
                closeModal();
                await onClickReportPost();
              });
            },
          },
          {
            name: "게시물 상세 페이지로 이동",
            func: () => {
              closeModal();
              navigate(`/post/${post.id}`);
            },
          },
        ]);
      } else {
        // post 모달창 버튼 props 지정
      settingPostModalProps([
        {
          name: "신고",
          func: () => {
            onClickButton("정말 신고 하시겠습니까?", "신고", async () => {
              closeModal();
              await onClickReportPost();
            });
          },
        },
      ]);
      }
    }
  }, []);

  return (
    userData && (
      <PostLi>
        <UserInfo
          right={"modalBtn"}
          userData={post.author}
          bottom={"account"}
          onClickModalBtn={onClickMore}
        />
        <PostContents>
          <PostText>{post.content}</PostText>
          {imgArray[0] && imgArray[0].length > 0 ? (
            <PostImgWrapper>
              <PostImgUl ref={ImgUlRef}>
                {imgArray.map((image, idx) => {
                  return (
                    <PostImgLi key={image + idx}>
                      <PostImg
                        src={image}
                        alt="포스트 이미지"
                        onError={(e) => (e.target.src = noImg)}
                      />
                    </PostImgLi>
                  );
                })}
              </PostImgUl>

              <PostImgBtnUl>
                {imgArray.map((image, idx) => {
                  return (
                    <PostImgBtnLi key={image + idx}>
                      {imgArray.length > 1 && (
                        <PostImgBtn
                          className={activeButton === idx ? "active" : ""}
                          onClick={(e) => onClickSliderBtn(e, idx)}
                        >
                          <PostButtonSpan className="a11y-hidden">
                            이미지 슬라이드 버튼
                          </PostButtonSpan>
                        </PostImgBtn>
                      )}
                    </PostImgBtnLi>
                  );
                })}
              </PostImgBtnUl>
            </PostImgWrapper>
          ) : null}

          <PostLikeCommentBtns>
            <PostLikeBtn onClick={onClickLike}>
              <PostLikeBtnIcon
                src={hearted ? heartFillIcon : heartIcon}
                alt="좋아요"
              />
              <PostHeartCount>{heartCount}</PostHeartCount>
            </PostLikeBtn>
            <PostCommentLink to={`/post/${post.id}`}>
              <PostCommentLinkIcon src={commentIcon} alt="댓글" />
              <PostCommentCount>{post.commentCount}</PostCommentCount>
            </PostCommentLink>
          </PostLikeCommentBtns>
          <DateFormate dateString={post.createdAt} />
        </PostContents>
      </PostLi>
    )
  );
}