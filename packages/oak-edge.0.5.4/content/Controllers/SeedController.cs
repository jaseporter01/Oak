﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Oak;

namespace Oak.Controllers
{
    public class LocalOnly : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if(filterContext.RequestContext.HttpContext.Request.IsLocal == false)
            {
                filterContext.Result = new HttpNotFoundResult();
            }
        }
    }

    [LocalOnly]
    public class SeedController : Controller
    {
        public Seed Seed { get; set; }

        public SeedController()
        {
            Seed = new Seed();
        }

        /// <summary>
        /// Change this method to create your tables.  Take a look 
        /// at each method, CreateSampleTable(), CreateAnotherSampleTable(), 
        /// AlterSampleTable() and AdHocChange()...you'll want to replace 
        /// this with your own set of methods.
        /// </summary>
        [HttpPost]
        public ActionResult All()
        {
            CreateSampleTable();

            CreateAnotherSampleTable();

            AlterSampleTable();

            AdHocChange();

            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult PurgeDb()
        {
            Seed.PurgeDb();

            return new EmptyResult();
        }

        /// <summary>
        /// Create sample entries for your database in this method.
        /// </summary>
        [HttpPost]
        public ActionResult SampleEntries()
        {
            //for example
            new
            {
                Id = Guid.NewGuid(),
                Title = "Hello World",
                Body = "Lorem Ipsum"
            }.InsertInto("Blogs");

            return new EmptyResult();
        }

        //here is a sample of how to create a table
        private void CreateSampleTable()
        {
            Seed.CreateTable("SampleTable", new dynamic[] 
            { 
                new { Id = "uniqueidentifier", PrimaryKey = true },
                new { Foo = "nvarchar(max)", Default = "Hello" },
                new { Bar = "int", Nullable = false }
            }).ExecuteNonQuery();
        }

        //here is another sample of how to create a table
        private void CreateAnotherSampleTable()
        {
            Seed.CreateTable("AnotherSampleTable", new dynamic[] 
            { 
                new { Id = "int", Identity = true, PrimaryKey = true },
                new { Foo = "nvarchar(max)", Default = "Hello", Nullable = false },
            }).ExecuteNonQuery();
        }

        //here is a sample of how to alter a table
        private void AlterSampleTable()
        {
            Seed.AddColumns("SampleTable", new dynamic[] 
            {
                new { AnotherColumn = "bigint" },
                new { YetAnotherColumn = "nvarchar(max)" }
            }).ExecuteNonQuery();
        }

        //different ad hoc queries
        private void AdHocChange()
        {
            //hey look, you can just do an ad hoc read
            var reader = "select * from SampleTable".ExecuteReader();
            while(reader.Read())
            {
                //do stuff here
            }

            //hey look, I can do a ad hoc scalar
            var name = "select top 1 name from sysobjects".ExecuteScalar() as string;

            //hey look, I can do an ad hoc non query
            "drop table SampleTable".ExecuteNonQuery();
        }

        protected override void OnException(ExceptionContext filterContext)
        {
            filterContext.Result = Content(filterContext.Exception.Message);
            filterContext.ExceptionHandled = true;
        }
    }
}
