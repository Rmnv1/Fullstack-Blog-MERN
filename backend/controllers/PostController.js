import PostModel from "../models/Post.js"

// get all posts
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts)

    // console.log(PostModel.find(id => '638b8c1ef534736a7d9016a0'));

  } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Не удалось получить статьи'
      })
  }
}

// get one post by id
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate({
      _id: postId,
    }, 
    {
      $inc: { viewsCount: 1 }
    },
    {
      returnDocument: 'after'
    },
    (error, doc) => {
      if (error) {
        console.log(error)
        return res.status(500).json({
          message: 'Не удалось получить статью'
        })
      }

      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена'
        })
      }

      res.json(doc)
    }
    )

  } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Не удалось получить статью'
      })
  }
}

// create new post
export const create = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json(errors.array())
    // }
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    })

    const post = await doc.save()

    res.json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось создать статью'
    })
  }
}

// remove post by id
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId
    }, (error, doc) => {
      if (error) {
        console.log(error)
        return res.status(500).json({
          message: 'Не удалось удалить статью'
        })
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Статья не найдена'
        })
      }

      res.json({
        success: true
      })
    })

  } catch (error) {
      console.log(error)
      res.status(500).json({
        message: 'Не удалось удалить статью'
      })
  }
}

// update post by id
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId
    },
    {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags
    })

    res.json({
      success: true
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не удалось обновить статью'
    })
  }
}